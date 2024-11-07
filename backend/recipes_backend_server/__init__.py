import json
import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS

load_dotenv()

from .blueprints import *
from . import db

public_directory = os.environ["RECIPES_BACKEND_PUBLIC_DIRECTORY"]
Path(public_directory).mkdir(exist_ok=True)

app = Flask(__name__)
CORS(app, resources={"/api/*": {"origins": "*"}, "/admin/*": {"origins": "*"}})

recipes_db = db.recipes_db


@app.errorhandler(Exception)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    try:
        response = e.get_response()
    except:
        response = Response(status=500)

    raise e
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
def get_category(category):
    limit = request.args.get("limit", 10)
    if limit > 50:
        raise ValueError("Limit can not be greater than 50")
    page = request.args.get("page", 0)

    recipes = recipes_db.get_category(category, limit, page)

    return jsonify([x.as_recipe("/api/v1/images/{fname}") for x in recipes])


@app.route("/api/v1/recipes/content/<int:id>")
def get_recipe(id):
    resp = recipes_db.get_recipe(id)
    return jsonify(resp)


@app.route("/api/v1/images/<fname>")
def get_images(fname):
    return send_from_directory(public_directory, fname)


@app.route("/api/v1/recipes/search", methods=["POST"])
def search_recipes():
    limit = request.args.get("limit", 10)
    if limit > 50:
        raise ValueError("Limit can not be greater than 50")
    page = request.args.get("page", 0)

    recipes = recipes_db.search(request.json, limit, page)

    return jsonify([x.as_recipe("/api/v1/images/{fname}") for x in recipes])


app.register_blueprint(admin, url_prefix="/admin")
