# models.py
# ─────────────────────────────────────────────────────────────────────────────
# Defines the SQLAlchemy ORM model that maps to the MySQL `notes` table.
# ─────────────────────────────────────────────────────────────────────────────

from sqlalchemy import Column, Integer, Text
from database import Base


class Note(Base):
    """
    ORM representation of the `notes` table.

    Columns:
        id      → auto-incrementing primary key
        message → the text content of the note (cannot be empty)
    """
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    message = Column(Text, nullable=False)
