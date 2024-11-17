import sys
import pathlib

sys.path.append(str(pathlib.Path(__file__).parent.parent.resolve()))

import recipes_backend_server

app = recipes_backend_server.app
