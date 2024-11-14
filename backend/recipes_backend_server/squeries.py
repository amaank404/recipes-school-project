from typing import Self
import re

_allowed_ops = ["=", ">", "<", "<>", "!=", ">=", "<="]


def _alias_gen():
    i = 0
    while True:
        yield f"ta{i}"


def _search_query(usr_data: str) -> str:
    return (
        "'%"
        + usr_data.replace("'", "''")
        .replace("~", "~~")
        .replace("%", "~%")
        .replace("_", "~_")
        .replace("*", "%")
        .replace("?", "_")
        .replace(" ", "?%")
        + "%'"
    )


def _escape(s: str | int | float) -> str:
    if isinstance(s, (int, float)):
        return str(s)

    return f"'{s.replace("'", "''")}'"


_COL_PATTERN = re.compile(r"\w*\.?\w+")


def _checkcol(s: str) -> bool:
    return all(
        (
            "\n" not in s,
            " " not in s,
            _COL_PATTERN.match(s) is not None,
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
        self._between: list[tuple[str, int | float, int | float]] = []
        self._ops: list[tuple[str, int | float, str]] = []
        self._order_by: list[tuple[str, str]] = []
        self._contains: list[tuple[str, list[str]]] = []
        self._limit = None
        self._offset = None
        self._distinct: bool = False

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

    def order_by(self, column: str, order: str = None) -> Self:
        if order is None:
            order = "ASC"
        assert order.upper() in ["ASC", "DESC"]
        self._order_by.append((column, order))
        return self

    def equal(self, column: str, val: str) -> Self:
        self._ops.append((column, val, "="))
        return self

    def between(self, column: str, start: float | int, end: float | int) -> Self:
        self._between.append((column, start, end))
        return self

    def greater(self, column: str, st) -> Self:
        self._ops.append((column, st, ">"))
        return self

    def lesser(self, column: str, st) -> Self:
        self._ops.append((column, st, "<"))
        return self

    def greater_eq(self, column: str, st) -> Self:
        self._ops.append((column, st, ">="))
        return self

    def lesser_eq(self, column: str, st) -> Self:
        self._ops.append((column, st, "<="))
        return self

    def not_equal(self, column: str, st) -> Self:
        self._ops.append((column, st, "<>"))
        return self

    def limit(self, limit: int) -> Self:
        self._limit = limit
        return self

    def offset(self, offset: int) -> Self:
        self._offset = offset
        return self

    def contains(self, column: str, *st) -> Self:
        self._contains.append((column, st))
        return self

    def _prepend_col(self, col: str) -> str:
        if "." in col:
            return col
        else:
            return f"{self._table}.{col}"

    def distinct(self, distinct: bool = True) -> Self:
        self._distinct = distinct
        return self

    def build(self) -> str:
        assert self._table is not None

        query = ["SELECT"]

        if self._distinct:
            query.append("DISTINCT")

        assert all(map(_checkcol, self._columns))

        cols = ", ".join(map(self._prepend_col, self._columns))
        cols = "*" if len(cols) == 0 else cols

        query.append(f"{cols}")
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

        for col, p, op in self._ops:
            assert _checkcol(col)
            assert isinstance(p, (str, int, float))
            assert op in _allowed_ops, "Operation not found"
            col = self._prepend_col(col)
            query.append(f"({col} {op} {_escape(p)})")
            query.append("AND")

        for col, a, b in self._between:
            assert _checkcol(col)
            assert isinstance(a, (int, float))
            assert isinstance(b, (int, float))
            col = self._prepend_col(col)
            query.append(f"({col} BETWEEN {a} AND {b})")
            query.append("AND")

        for col, p in self._search:
            assert _checkcol(col)
            assert isinstance(p, str)
            col = self._prepend_col(col)
            query.append(f"({col} LIKE {_search_query(p.lower())} ESCAPE '~')")
            query.append("AND")

        for col, p in self._contains:
            assert _checkcol(col)
            assert isinstance(p, (list, tuple))
            for x in p:
                assert isinstance(x, (int, float, str))
            col = self._prepend_col(col)
            query.append(f"({col} IN ({', '.join(map(_escape, p))}))")
            query.append(f"AND")

        query.pop()

        query.append("ORDER BY")

        for col, order in self._order_by:
            assert _checkcol(col)
            col = self._prepend_col(col)
            query.append(f"{col} {order}")
            query.append(",")

        query.pop()

        if self._limit is not None:
            assert isinstance(self._limit, int)
            query.append(f"LIMIT {self._limit}")

        if self._offset is not None:
            assert isinstance(self._offset, int)
            query.append(f"OFFSET {self._offset}")

        return " ".join(query)
