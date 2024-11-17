from recipes_backend_server.squeries import SearchQuery

q = (
    SearchQuery()
    .table("recipes")
    .join("tags", "id", "id")
    .columns(
        "id",
        "name",
        "tags.tag",
    )
    .search("name", "This is SearchQuery's query engine")
    .greater("id", 4)
    .order_by("id")
)


print(q.build())
