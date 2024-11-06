from flask import Blueprint, request
from ..db import recipes_db
from ..types import *

admin = Blueprint("admin", __name__)


@admin.route("/recipe/add", methods=["POST"])
def add_recipe():
    recipes_db.add_recipe(Recipe.from_json(request.json))
