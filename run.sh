#!/bin/bash
# poetry run python -m recipes_backend_server
waitress-serve --host localhost --port 9422 "recipes_backend_server:app" 