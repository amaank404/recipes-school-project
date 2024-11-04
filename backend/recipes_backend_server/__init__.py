from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/v1/recipes/<category>")
def get_recipes(category):



    d = [
        
    ]

    return jsonify(d)