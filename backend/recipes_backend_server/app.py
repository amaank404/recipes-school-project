from . import app


def run_app():
    app.run(debug=True, port=9422)
