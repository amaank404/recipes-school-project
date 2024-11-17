import functools
import json
import os
import secrets
from pathlib import Path
import hashlib

from flask import Blueprint, jsonify, request

from ..db import recipes_db
from ..dtypes import *
from .. import recipes_ai

from PIL import Image

admin = Blueprint("admin", __name__)

public_directory = Path(os.getenv("RECIPES_BACKEND_PUBLIC_DIRECTORY"))
admin_password = os.getenv("RECIPES_BACKEND_PASSWORD")


tokens = []


def get_fname(imdata: bytes):
    d = hashlib.sha256(imdata).hexdigest()

    return public_directory / (d + ".png")


def resize_img(datastream):
    im = Image.open(datastream)

    aspect_ratio = im.width / im.height

    h = 1500
    w = int(aspect_ratio * h)

    h1 = 300
    w1 = int(aspect_ratio * h1)

    imoriginal = im.resize((w, h)) if im.height > h else im
    imthumb = im.resize((w1, h1)) if im.height > h1 else im
    imthumb = imthumb.convert("RGB")

    fname = get_fname(imoriginal.tobytes())
    imoriginal.save(fname, "png")
    imthumb.save(fname.with_suffix(".png.jpg"), "jpeg")

    return fname


def needs_token(fn):
    def token_wrapper(*args, **kwargs):
        if request.values["token"] in tokens:
            return fn(*args, **kwargs)
        else:
            raise ValueError("Needs Auth")

    token_wrapper.__name__ = fn.__name__
    return token_wrapper


@admin.route("/recipes/add", methods=["POST"])
@needs_token
def add_recipe():
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


@admin.route("/recipes/remove", methods=["POST"])
@needs_token
def remove_recipe():
    recipe_data = request.json

    file_removals = []

    for x in recipe_data:
        r = recipes_db.get_recipe(x, contents=False)
        p = public_directory / r.image_file
        p2 = public_directory / (r.image_file + ".jpg")

        file_removals.append(p)
        file_removals.append(p2)

    recipes_db.delete_recipe(recipe_data)

    return jsonify({"status": "OKAY"})


@admin.route("/auth", methods=["POST"])
def get_token():
    if request.form["password"] == admin_password:
        tokens.append(token := secrets.token_urlsafe(32))
        return jsonify({"token": token})
    else:
        raise ValueError("Authentication Error")


@admin.route("/gen_recipe/<recipe>")
@needs_token
@functools.lru_cache(maxsize=1000)
def gen_recipe(recipe):
    return jsonify(recipes_ai.process_data(recipes_ai.get_recipe(recipe)))


@admin.route("/token_check", methods=["POST", "GET"])
def check_token():
    if request.values["token"] in tokens:
        return jsonify({"status": "OKAY"})
    raise ValueError("Token Invalid")
