from typing import Self

_allowed_ops = ["=", ">", "<", "<>", "!=", ">=", "<="]


def _alias_gen():
    i = 0
    while True:
        yield f"ta{i}"


def _search_query(usr_data: str) -> str:
    return (
        usr_data.replace("'", "''")
        .replace("%", r"\%")
        .replace("_", r"\_")
        .replace("*", "%")
        .replace("?", "_")
        .replace(" ", "?%")
    )


def _escape(s: str) -> str:
    return s.replace("'", "''")


def _checkcol(s: str) -> bool:
    return all(
        (
            "\n" not in s,
            " " not in s,
            s.isalnum(),
            s.isascii(),
            isinstance(s, str),
        )
    )


class SearchQuery:
    def __init__(self):
        self._table: str = None
        self._columns: list[str] = []
        self._joins: list[tuple[str, str, str, str]] = []
        self._search: list[tuple[str, str]] = []
        self._where: list[tuple[str, str]] = []
        self._between: list[tuple[str, int | float, int | float]] = []
        self._ops: list[tuple[str, int | float, str]] = []

    def table(self, table: str) -> Self:
        assert _checkcol(table)
        self._table = table
        return self

    def join(self, table: str, from_col: str, to_col: str, to_col_table=None) -> Self:
        self._joins.append((table, from_col, to_col, to_col_table))
        return self

    def columns(self, *columns: list[str]) -> Self:
        self._columns.extend(columns)
        return self

    def search(self, column: str, query: str) -> Self:
        self._search.append((column, query))
        return self

    def where(self, column: str, val: str) -> Self:
        self._where.append((column, val))
        return self

    def between(self, column: str, start: float | int, end: float | int) -> Self:
        self._between.append((column, start, end))
        return self

    def greater(self, column: str, st) -> Self:
        self._ops.append((column, st, ">"))
        return self

    def build(self) -> str:
        query = ["SELECT"]

        assert all(map(_checkcol, self._columns))

        cols = ",".join(self._columns)
        cols = "*" if len(cols) == 0 else cols

        query.append(cols)
        query.append("FROM")
        query.append(self._table)

        for x in self._joins:
            if x[-1] is None:
                x = x[:-1] + (self._table,)
            assert all(map(_checkcol, x))
            query.append(
                "INNER JOIN {table} ON {table}.{from_col} = {target}.{to_col}".format(
                    table=x[0], from_col=x[1], to_col=x[2], target=x[3]
                )
            )

        query.append("WHERE")
        for col, p in self._where:
            assert _checkcol(col)
            assert isinstance(p, (str, float, int))
            query.append(f"({col} = '{_escape(p)}')")
            query.append("AND")

        for col, p, op in self._ops:
            assert _checkcol(col)
            assert isinstance(p, (int, float))
            assert op in _allowed_ops, "Operation not found"
            query.append(f"({col} {op} {p})")
            query.append("AND")

        for col, a, b in self._between:
            assert _checkcol(col)
            assert isinstance(a, (int, float))
            assert isinstance(b, (int, float))
            query.append(f"({col} BETWEEN {a} AND {b})")
            query.append("AND")

        for col, p in self._search:
            assert _checkcol(col)
            assert isinstance(p, str)
            query.append(f"({col} LIKE '{_search_query(p)}' ESCAPE '\\')")
            query.append("AND")

        query.pop()

        return " ".join(query)
