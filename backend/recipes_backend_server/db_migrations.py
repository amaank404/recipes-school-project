from .dbutil import *


class Migrations:
    def __init__(self, conn, v):
        self.conn = conn
        self.v = v

    def apply_migrations(self):
        for x in sorted(
            [x for x in dir(self) if x.startswith("mig")],
            key=lambda x: int(x.removeprefix("mig")),
        ):
            v = int(x.removeprefix("mig"))
            if v > self.v:
                getattr(self, x)()
                with self.conn.cursor() as cursor:
                    cursor.execute(
                        "UPDATE metadata SET value=%s WHERE name='version'",
                        (str(v),),
                    )
                    self.conn.commit()

    def mig1(self):
        print("Migrated to v1")
        executescript(
            self.conn,
            """
CREATE TABLE recipes(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    base VARCHAR(40) NOT NULL,
    date_added DATETIME,
    image_file VARCHAR(255),
    recipe_content TEXT
);

CREATE TABLE tags(
    id INTEGER,
    tag VARCHAR(30),
    CONSTRAINT FK_RecipeTag FOREIGN KEY (id) REFERENCES recipes(id) ON UPDATE CASCADE ON DELETE CASCADE
);
""",
        )

    def mig2(self):
        print("Create popularity table")
        executescript(
            self.conn,
            """
CREATE TABLE popularity (
    id INTEGER,
    popularity BIGINT,
    CONSTRAINT Fk_PopularityId FOREIGN KEY (id) REFERENCES recipes(id) ON UPDATE CASCADE ON DELETE CASCADE
);
""",
        )


def migrate(conn, v):
    Migrations(conn, v).apply_migrations()
