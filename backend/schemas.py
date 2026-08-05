# schemas.py
# ─────────────────────────────────────────────────────────────────────────────
# Pydantic schemas for request validation and response serialization.
# ─────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel, Field


# ── Request schemas ────────────────────────────────────────────────────────

class NoteCreate(BaseModel):
    """Schema used when creating a new note (POST /notes)."""
    message: str = Field(..., min_length=1, description="Text content of the note")


class NoteUpdate(BaseModel):
    """Schema used when updating an existing note (PUT /notes/{id})."""
    message: str = Field(..., min_length=1, description="Updated text content of the note")


# ── Response schemas ───────────────────────────────────────────────────────

class NoteResponse(BaseModel):
    """Schema returned by the API for a single note."""
    id: int
    message: str

    # Pydantic v2: tell the model to read data from ORM attributes
    model_config = {"from_attributes": True}
