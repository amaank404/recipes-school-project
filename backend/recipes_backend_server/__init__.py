from flask import Flask, jsonify
from dotenv import load_dotenv

load_dotenv()

from . import db

app = Flask(__name__)

recipes_db = db.recipes_db


@app.route("/api/v1/recipes/<category>")
def get_recipes(category):

    d = []

    return jsonify(d)
