import logging
from flask.logging import default_handler
from pymysql import connect, Connection
import pymysqlpool
from .db_migrations import migrate
from .dtypes import *
from .dbutil import *
from .squeries import SearchQuery
import os

# Load from environment variables
dbtype = os.getenv("RECIPES_BACKEND_DB_TYPE", "mysql")
host = os.getenv("RECIPES_BACKEND_DB_HOST", "localhost")
port = int(os.getenv("RECIPES_BACKEND_DB_PORT", "3306"))
database = os.getenv("RECIPES_BACKEND_DB_NAME", "recipes_db")
user = os.getenv("RECIPES_BACKEND_DB_USER", "root")
passwd = os.getenv("RECIPES_BACKEND_DB_PASSWORD")

# FIXME: Race conditions
# https://stackoverflow.com/questions/71564954/pymysql-error-packet-sequence-number-wrong-got-1-expected-0

db_config = {
    "host": host,
    "port": port,
    "user": user,
    "password": passwd,
    "database": database,
}

if dbtype in ("mysql", "mariadb"):
    conn = connect(host=host, port=port, user=user, passwd=passwd)
else:
    raise ValueError(
        f"No such db type as: {dbtype} provided by environment RECIPES_BACKEND_DB_TYPE"
    )

# Make sure that the db exists
executescript(
    conn,
    f"""
CREATE DATABASE IF NOT EXISTS {database};
""",
)

conn.close()

connpool = pymysqlpool.ConnectionPool(
    size=1, maxsize=1, pre_create_num=1, name="pool1", **db_config
)


class RecipesDB:
    _allowed_search_fns = {
        "search",
        "order_by",
        "equal",
        "between",
        "greater",
        "lesser",
        "greater_eq",
        "lesser_eq",
        "not_equal",
        "contains",
    }

    def __init__(self, connpool):
        self.connpool = connpool
        self.create_db()

    def create_db(self):
        conn = self.connpool.get_connection()
        executescript(
            conn,
            """
CREATE TABLE IF NOT EXISTS metadata (
    name VARCHAR(20) PRIMARY KEY,
    value VARCHAR(200)
);
""",
        )

        v = int(self.set_metadata_default(conn, "version", "0"))
        conn.commit()
        migrate(conn, v)
        conn.close()

    def set_metadata_default(self, conn, key, value):
        with conn.cursor() as cur:
            cur.execute("SELECT value FROM metadata WHERE name=%s", (key,))
            if cur.rowcount == 0:
                cur.execute("INSERT INTO metadata VALUES (%s, %s)", (key, value))
                conn.commit()
                return value
            v = cur.fetchone()[0]
            return v

    def get_recipe(self, id: int, contents: bool = True) -> Recipe:
        conn = self.connpool.get_connection()
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT name, base, date_added, image_file{', recipe_content' if contents else ''} FROM recipes WHERE id=%s",
                (id,),
            )

            d = cur.fetchone()
            if d is None:
                raise ValueError("No such recipe")

            name, base, date_added, image_file, *recipe_content = d

            cur.execute("SELECT tag FROM tags WHERE id=%s", (id,))
            tags = [x[0] for x in cur]

        if not contents:
            recipe_content.append("")

        conn.close()
        return Recipe(
            id=id,
            name=name,
            base=base,
            date_added=date_added,
            image_file=image_file,
            recipe=recipe_content[0],
            tags=tags,
        )

    def increase_popularity(self, id):
        with self.connpool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE popularity SET popularity=(popularity+1) WHERE id=%s", (id,)
                )
            conn.commit()

    def add_recipe(self, recipe: Recipe) -> None:
        """
        does not take recipe.id into account, id is auto generated and returned
        """
        conn = self.connpool.get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO recipes(name, base, date_added, image_file, recipe_content) VALUES (%s, %s, %s, %s, %s)",
                (
                    recipe.name,
                    recipe.base,
                    to_datetime_str(recipe.date_added),
                    recipe.image_file,
                    recipe.recipe,
                ),
            )

            cur.execute(
                "SELECT id FROM recipes WHERE name=%s AND base=%s AND date_added=%s",
                (recipe.name, recipe.base, to_datetime_str(recipe.date_added)),
            )

            id = cur.fetchone()

            cur.execute(
                "INSERT INTO popularity(id, popularity) VALUES (%s, %s)", (id, 0)
            )

            cur.executemany(
                "INSERT INTO tags VALUES (%s, %s)",
                [(id, x) for x in recipe.tags],
            )

        conn.commit()
        conn.close()

    def update_recipe(self, recipe: Recipe) -> int:
        with self.connpool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE recipes SET name=%s, base=%s, date_added=%s, image_file=%s, recipe_content=%s WHERE id=%s",
                    (
                        recipe.name,
                        recipe.base,
                        to_datetime_str(recipe.date_added),
                        recipe.image_file,
                        recipe.recipe,
                        int(recipe.id),
                    ),
                )

                cur.execute("DELETE FROM tags WHERE id=%s", (int(recipe.id),))

                cur.executemany(
                    "INSERT INTO tags VALUES (%s, %s)",
                    [(recipe.id, x) for x in recipe.tags],
                )

            conn.commit()
        return recipe.id

    def _validate_order_type(self, order_by: str) -> str:
        valid_order_by_types = ("name", "base", "date_added")
        order_by = order_by.replace("-", "_")
        if order_by not in valid_order_by_types:
            raise ValueError("Unknown order by value")
        return order_by

    def delete_recipe(self, id):
        with self.connpool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.executemany("DELETE FROM recipes WHERE id=%s", [(x,) for x in id])
            conn.commit()

    def get_category(
        self, category: str, page_limit: int = 10, page: int = 0
    ) -> list[Recipe]:
        conn = self.connpool.get_connection()
        cat_type, *cat_params, cat_order = category.split("_")

        if cat_order.upper().strip() not in ("ASC", "DESC", ""):
            raise ValueError("Unknown order type, choose asc or desc")

        if cat_type == "tag":
            (tag, order_by) = cat_params

            tag = tag.replace("-", " ")
            order_by = self._validate_order_type(order_by)

            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT r.id, r.name, r.base, r.date_added, r.image_file FROM tags t INNER JOIN recipes r ON t.id = r.id WHERE tag=%s ORDER BY r.{order_by} {cat_order} LIMIT %s OFFSET %s",
                    (tag, page_limit, page_limit * page),
                )
                data = cur.fetchall()
        elif cat_type == "top":
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT r.id, r.name, r.base, r.date_added, r.image_file FROM popularity p INNER JOIN recipes r ON p.id = r.id ORDER BY popularity DESC LIMIT %s OFFSET %s",
                    (page_limit, page_limit * page),
                )
                data = cur.fetchall()
        elif cat_type == "base":
            (base, order_by) = cat_params

            base = base.replace("-", " ")
            order_by = self._validate_order_type(order_by)

            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT id, name, base, date_added, image_file FROM recipes WHERE base=%s ORDER BY {order_by} {cat_order} LIMIT %s OFFSET %s",
                    (base, page_limit, page_limit * page),
                )
                data = cur.fetchall()
        elif cat_type == "date-added":
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT id, name, base, date_added, image_file FROM recipes ORDER BY date_added DESC LIMIT %s OFFSET %s",
                    (page_limit, page_limit * page),
                )
                data = cur.fetchall()
        else:
            raise TypeError("No such category type")
        conn.close()
        d = []

        for id, name, base, date_added, image_file in data:
            d.append(
                Recipe(
                    id=id,
                    name=name,
                    base=base,
                    image_file=image_file,
                    date_added=date_added,
                    tags=self.get_tags(id),
                )
            )

        return d

    def get_tags(self, id) -> list[str]:
        with self.connpool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT tag FROM tags WHERE id=%s", (id,))
                return [x[0] for x in cur.fetchall()]

    def get_all_tags(self) -> list[str]:
        with self.connpool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT DISTINCT tag FROM tags ORDER BY tag")
                return [x[0] for x in cur.fetchall()]

    def get_all_bases(self) -> list[str]:
        with self.connpool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT DISTINCT base FROM recipes ORDER BY base")
                return [x[0] for x in cur.fetchall()]

    def search(self, query: list[tuple[str, ...]], page_limit: int = 10, page: int = 0):
        q = SearchQuery()

        for x, *params in query:
            if x not in self._allowed_search_fns:
                raise TypeError(f"Invalid search function: {x} in query: {query}")
            getattr(q, x)(*params)

        s = (
            q.table("recipes")
            .join("tags", "id", "id", join_type="LEFT")
            .join("popularity", "id", "id")
            .columns("id", "name", "base", "date_added", "image_file")
            .limit(page_limit)
            .offset(page_limit * page)
            .distinct()
            .build()
        )

        conn = self.connpool.get_connection()
        with conn.cursor() as cur:
            print(f"Run search query: {s}")
            cur.execute(s)
            data = cur.fetchall()

        conn.close()

        d = []

        for id, name, base, date_added, image_file in data:
            d.append(
                Recipe(
                    id=id,
                    name=name,
                    base=base,
                    image_file=image_file,
                    date_added=date_added,
                    tags=self.get_tags(id),
                )
            )
        return d


recipes_db = RecipesDB(connpool)
