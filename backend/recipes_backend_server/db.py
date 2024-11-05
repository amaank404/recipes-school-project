from mysql.connector import connect, MySQLConnection
from mariadb import connect as mariadb_connect
from .db_migrations import migrate
import os

# Load from environment variables
dbtype = os.getenv("RECIPES_BACKEND_DB_TYPE", "mysql")
host = os.getenv("RECIPES_BACKEND_DB_HOST", "localhost")
port = int(os.getenv("RECIPES_BACKEND_DB_PORT", "3306"))
database = os.getenv("RECIPES_BACKEND_DB_NAME", "recipes_db")
user = os.getenv("RECIPES_BACKEND_DB_USER", "root")
passwd = os.getenv("RECIPES_BACKEND_DB_PASSWORD")


def executescript(conn, script):
    cur = conn.cursor()
    for x in script.split(";"):
        q = x.replace("\n", " ").replace("\r", " ")
        if q.strip() == "":
            continue
        try:
            cur.execute(q)
        except:
            print(q)
            raise
    conn.commit()


if dbtype == "mysql":
    conn = connect(host=host, port=port, user=user, passwd=passwd)
elif dbtype == "mariadb":
    conn = mariadb_connect(host=host, port=port, user=user, passwd=passwd)
else:
    raise ValueError(
        f"No such db type as: {dbtype} provided by environment RECIPES_BACKEND_DB_TYPE"
    )

executescript(
    conn,
    f"""
CREATE DATABASE IF NOT EXISTS {database};
USE {database};
""",
)


class RecipesDB:
    def __init__(self, conn: MySQLConnection):
        self.conn = conn
        self.create_db()

    def create_db(self):
        executescript(
            conn,
            """
CREATE TABLE IF NOT EXISTS recipes(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    base VARCHAR(40) NOT NULL,
    date_added DATETIME,
    image_file VARCHAR(255),
    recipe_content TEXT
);

CREATE TABLE IF NOT EXISTS tags(
    id INTEGER,
    tag VARCHAR(30),
    CONSTRAINT FK_RecipeTag FOREIGN KEY (id) REFERENCES recipes(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS metadata (
    name VARCHAR(20) PRIMARY KEY,
    value VARCHAR(200)
);
""",
        )
        v = int(self.set_metadata_default("version", "0"))
        self.conn.commit()
        migrate(self.conn, v)

    def set_metadata_default(self, key, value):
        cur = self.conn.cursor()
        cur.execute("SELECT value FROM metadata WHERE name=?", (key,))
        if cur.rowcount == 0:
            cur.execute("INSERT INTO metadata VALUES (?, ?)", (key, value))
            self.conn.commit()
            return value
        v = cur.fetchone()[0]
        return v


recipes_db = RecipesDB(conn)
