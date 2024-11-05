from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Recipe:
    id: int
    name: str
    base: str
    image_file: str
    recipe: str = None
    date_added: datetime = field(default_factory=lambda: datetime.now(tz=timezone.utc))
    tags: list[str] = field(default_factory=list)
