from . import app


def run_app():
    app.run(port=9422, debug=True)
