"""Module docstring: Onion syntax sample for Python."""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from typing import Generic, TypeVar

T = TypeVar("T")
MAX_RETRIES = 3  # ALL_CAPS constant (semantic: variable.readonly)


@dataclass(frozen=True)
class Onion(Generic[T]):
    """A layered thing. Docstrings get their own color."""

    name: str
    layers: list[T] = field(default_factory=list)

    def __init__(self, name: str, *args: T, **kwargs: object) -> None:
        self.name = name
        self.layers = [*args]

    @classmethod
    def from_dict(cls, data: dict[str, object]) -> "Onion[str]":
        return cls(str(data.get("name", "")), *map(str, data.get("layers", [])))

    @property
    def depth(self) -> int:
        return len(self.layers)

    async def peel(self, delay: float = 0.1) -> T | None:
        if (n := self.depth) == 0:
            return None
        await asyncio.sleep(delay)
        print(f"peeling {self.name!r}: {n:>3d} layers left, ratio={n / MAX_RETRIES:.2%}")
        return self.layers.pop()


def classify(value: object) -> str:
    match value:
        case int() | float() if value > 0:
            return "positive"
        case {"kind": kind, **rest}:
            return f"dict:{kind} ({len(rest)})"
        case _:
            return "unknown" if value is not None else "none"


squares = [x ** 2 for x in range(10) if x % 2 == 0]
pattern = r"^\d{3}-\w+$"
handler = lambda e: isinstance(e, ValueError) and not False

with open(__file__, encoding="utf-8") as fh:
    total = sum(1 for _ in fh)
