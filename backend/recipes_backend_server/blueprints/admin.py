import json
import os
import secrets
from pathlib import Path

from flask import Blueprint, jsonify, request

from ..db import recipes_db
from ..dtypes import *

from PIL import Image

admin = Blueprint("admin", __name__)

public_directory = Path(os.environ["RECIPES_BACKEND_PUBLIC_DIRECTORY"])


def get_fname():
    while True:
        d = public_directory / (secrets.token_hex(16) + ".png")
        if not d.exists():
            return d


def resize_img(datastream):
    im = Image.open(datastream)

    aspect_ratio = im.width / im.height

    h = 1000
    w = int(aspect_ratio * h)

    h1 = 300
    w1 = int(aspect_ratio * h1)

    imoriginal = im.resize((w, h))
    imthumb = im.resize((w1, h1))

    fname = get_fname()
    imoriginal.save(fname, "png")
    imthumb.save(fname.with_suffix(".png.jpg"), "jpeg")

    return fname


@admin.route("/recipes/add", methods=["POST"])
def add_recipe():
    recipe_data = json.loads(request.form["recipe_data"])
    image = request.files["image"]

    fname = resize_img(image.stream).name

    recipe = Recipe.from_json(recipe_data)
    recipe.image_file = fname

    print(recipe)

    i = recipes_db.add_recipe(recipe)
    return jsonify({"id": i})
