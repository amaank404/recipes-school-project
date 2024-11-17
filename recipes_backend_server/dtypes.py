from dataclasses import dataclass, field
from datetime import datetime, timezone


def to_datetime(d):
    datetime.strptime(d, "%Y-%m-%d %H:%M:%S")


def to_datetime_str(d):
    return d.strftime("%Y-%m-%d %H:%M:%S")


@dataclass
class Recipe:
    id: int
    name: str
    base: str
    image_file: str
    recipe: str = None
    date_added: datetime = field(default_factory=lambda: datetime.now(tz=timezone.utc))
    tags: list[str] = field(default_factory=list)

    def as_recipe(self, url_base):
        """
        takes url_base with 'fname' placeholder as a formattable string
        the url_base must not include the hostname:port, and should
        only include the path following the hostname:port.

        `/static/files/{fname}` is an example url_base
        """
        return {
            "id": str(self.id),
            "image_url": url_base.format(fname=self.image_file),
            "name": self.name,
            "base": self.base,
            "tags": self.tags,
            "date_added": to_datetime_str(self.date_added),
        }

    def as_recipe_data(self, url_base):
        return {"recipe": self.as_recipe(url_base), "content": self.recipe}

    @staticmethod
    def from_json(data):
        return Recipe(
            id=data.get("id", -1),
            name=data["name"],
            base=data["base"],
            image_file=data.get("image_url", ""),
            recipe=data.get("recipe"),
            tags=data["tags"],
        )
