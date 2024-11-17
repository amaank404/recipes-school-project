import functools
import hashlib
import json
import os
import secrets
import traceback
from pathlib import Path
from io import BytesIO

from dotenv import load_dotenv
from flask import Flask, Response, jsonify, redirect, request, send_from_directory
from flask_caching import Cache
from flask_cors import CORS
from PIL import Image

load_dotenv()

import vercel_blob
from . import db, recipes_ai
from .dtypes import *

public_directory = os.getenv("RECIPES_BACKEND_STORAGE_DIRECTORY")
public_directory = Path(public_directory)
public_directory.mkdir(exist_ok=True)
public_directory = str(public_directory.resolve())
image_api_url = os.getenv(
    "RECIPES_BACKEND_IMAGE_API_URL", "http://localhost:9422/api/v1/image/{fname}"
)
admin_password = os.getenv("RECIPES_BACKEND_PASSWORD")
storage_type = os.getenv("RECIPES_BACKEND_STORAGE_PROVIDER", "local")

app = Flask(__name__)
CORS(app, resources={"/api/*": {"origins": "*"}, "/admin/*": {"origins": "*"}})
cache = Cache(
    config={"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 24 * 60 * 60}
)
cache.init_app(app)

recipes_db = db.recipes_db

IMAGE_API_TEMPLATE = image_api_url


@app.errorhandler(Exception)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error

    try:
        raise e
    except Exception:
        print(traceback.format_exc())

    try:
        response = e.get_response()
    except:
        response = Response(status=500)

    # replace the body with JSON
    response.data = json.dumps(
        {
            "code": e.code if hasattr(e, "code") else 500,
            "error": e.__class__.__name__,
            "msg": str(e),
        }
    )
    response.content_type = "application/json"
    return response


@app.route("/api/v1/recipes/cat/<category>")
@cache.cached()
def get_category(category):
    recipes = recipes_db.get_category(category)

    return jsonify([x.as_recipe(IMAGE_API_TEMPLATE) for x in recipes])


@app.route("/api/v1/recipes/get/<int:id>")
@cache.cached()
def get_recipe(id):
    recipes_db.increase_popularity(id)
    resp = recipes_db.get_recipe(id)
    return jsonify(resp.as_recipe_data(IMAGE_API_TEMPLATE))


@app.route("/static/image/<fname>")
def get_images(fname):
    if storage_type == "local":
        return send_from_directory(public_directory, fname)
    elif storage_type == "vercel":
        return redirect(vercel_blob.head(f"{public_directory}/{fname}")["downloadUrl"])


@app.route("/api/v1/recipes/search", methods=["POST"])
def search_recipes():
    limit = request.args.get("limit", 50)
    if limit > 100:
        raise ValueError("Limit can not be greater than 100")
    page = int(request.args.get("page", 0))

    recipes = recipes_db.search(request.json["query"], limit, page)

    return jsonify([x.as_recipe(IMAGE_API_TEMPLATE) for x in recipes])


@app.route("/api/v1/get_all_tags")
@cache.cached()
def get_all_tags():
    return jsonify(recipes_db.get_all_tags())


@app.route("/api/v1/get_all_categories")
@cache.cached()
def get_all_categories():
    return jsonify(recipes_db.get_all_bases())


@app.route("/api/ping")
def ping():
    return "pong"


tokens = []

public_directory_path = Path(public_directory)


def get_fname(imdata: bytes):
    d = hashlib.sha256(imdata).hexdigest()

    return public_directory_path / (d + ".jpeg")


def resize_img(datastream):
    im = Image.open(datastream)

    aspect_ratio = im.width / im.height

    h = 800
    w = int(aspect_ratio * h)

    h1 = 200
    w1 = int(aspect_ratio * h1)

    imoriginal = im.resize((w, h)) if im.height > h else im
    imthumb = im.resize((w1, h1)) if im.height > h1 else im
    imthumb = imthumb.convert("RGB")

    fname = get_fname(imoriginal.tobytes())
    if storage_type == "local":
        imoriginal.save(fname, "jpeg")
        imthumb.save(fname.with_suffix(".jpeg.jpg"), "jpeg")
    elif storage_type == "vercel":
        buf = BytesIO()
        imoriginal.save(buf, "jpeg")
        buf.seek(0)
        fname1 = str(fname).replace("\\", "/")
        vercel_blob.delete(fname1)
        vercel_blob.put(
            fname1, buf.read(), {"access": "public", "addRandomSuffix": "false"}
        )

        buf = BytesIO()
        imthumb.save(buf, "jpeg")
        buf.seek(0)
        fname2 = str(fname.with_suffix(".jpeg.jpg")).replace("\\", "/")
        vercel_blob.delete(
            fname2,
        )
        vercel_blob.put(
            fname2,
            buf.read(),
            {"access": "public", "addRandomSuffix": "false"},
        )

    return fname


def needs_token(fn):
    def token_wrapper(*args, **kwargs):
        if request.values["token"] in tokens:
            return fn(*args, **kwargs)
        else:
            raise ValueError("Needs Auth")

    token_wrapper.__name__ = fn.__name__
    return token_wrapper


@app.route("/admin/recipes/add", methods=["POST"])
@needs_token
def add_recipe():
    cache.clear()
    recipe_data = json.loads(request.form["recipe_data"])
    image = request.files["image"]

    fname = resize_img(image.stream).name

    recipe = Recipe.from_json(recipe_data)
    recipe.image_file = fname

    if recipe.id == "new":
        i = recipes_db.add_recipe(recipe)
    else:
        i = recipes_db.update_recipe(recipe)

    return jsonify({"id": i})


@app.route("/admin/recipes/remove", methods=["POST"])
@needs_token
def remove_recipe():
    cache.clear()
    recipe_data = request.json

    file_removals = []

    for x in recipe_data:
        r = recipes_db.get_recipe(x, contents=False)
        p = public_directory_path / r.image_file
        p2 = public_directory_path / (r.image_file + ".jpg")

        file_removals.append(p)
        file_removals.append(p2)

    recipes_db.delete_recipe(recipe_data)
    for x in file_removals:
        if storage_type == "local":
            x.unlink()
        elif storage_type == "vercel":
            vercel_blob.delete(str(p).replace("\\", "/"))

    return jsonify({"status": "OKAY"})


@app.route("/admin/auth", methods=["POST"])
def get_token():
    if request.form["password"] == admin_password:
        tokens.append(token := secrets.token_urlsafe(32))
        return jsonify({"token": token})
    else:
        raise ValueError("Authentication Error")


@app.route("/admin/gen_recipe/<recipe>")
@needs_token
@functools.lru_cache(maxsize=1000)
def gen_recipe(recipe):
    return jsonify(recipes_ai.process_data(recipes_ai.get_recipe(recipe)))


@app.route("/admin/token_check", methods=["POST", "GET"])
def check_token():
    if request.values["token"] in tokens:
        return jsonify({"status": "OKAY"})
    raise ValueError("Token Invalid")


@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    if request.path.startswith("/api") or request.path.startswith("/admin"):
        r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        r.headers["Pragma"] = "no-cache"
        r.headers["Expires"] = "0"
    else:
        r.headers["Cache-Control"] = "max-age=86400, must-revalidate"
        r.headers["Age"] = "0"
    return r
