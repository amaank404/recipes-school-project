migrations = [""]


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
                cursor = self.conn.cursor()
                cursor.execute(
                    "UPDATE metadata SET value=? WHERE name='version'",
                    (str(v),),
                )
                self.conn.commit()

    def mig1(self):
        print("Migrated to v1")


def migrate(conn, v):
    Migrations(conn, v).apply_migrations()
