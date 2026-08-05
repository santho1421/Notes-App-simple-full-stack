# main.py
# ─────────────────────────────────────────────────────────────────────────────
# Entry point for the FastAPI application.
# Defines all REST API routes and wires them to the CRUD helpers.
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import crud
import schemas
from database import engine, get_db

# ── Create all tables in MySQL if they don't exist yet ─────────────────────
models.Base.metadata.create_all(bind=engine)

# ── FastAPI application instance ───────────────────────────────────────────
app = FastAPI(
    title="Notes API",
    description="A simple CRUD API for managing notes.",
    version="1.0.0",
)

# ── CORS Middleware ────────────────────────────────────────────────────────
# Allow the React dev server (port 5173) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React Vite default port
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],
)


# ── Health check ───────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    """Simple health-check endpoint."""
    return {"message": "Notes API is running!"}


# ── CREATE ─────────────────────────────────────────────────────────────────

@app.post(
    "/notes",
    response_model=schemas.NoteResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Notes"],
)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    """
    Create a new note and persist it to the database.

    - **message**: Text content of the note (required, non-empty)
    """
    return crud.create_note(db=db, note=note)


# ── READ ALL ───────────────────────────────────────────────────────────────

@app.get(
    "/notes",
    response_model=list[schemas.NoteResponse],
    tags=["Notes"],
)
def get_notes(db: Session = Depends(get_db)):
    """
    Retrieve all notes from the database, ordered by creation time (id asc).
    Returns an empty list if no notes exist yet.
    """
    return crud.get_all_notes(db=db)


# ── UPDATE ─────────────────────────────────────────────────────────────────

@app.put(
    "/notes/{note_id}",
    response_model=schemas.NoteResponse,
    tags=["Notes"],
)
def update_note(
    note_id: int,
    note: schemas.NoteUpdate,
    db: Session = Depends(get_db),
):
    """
    Update the message of an existing note by its ID.

    - **note_id**: Integer primary key of the note to update
    - **message**: New text content (required, non-empty)
    """
    updated = crud.update_note(db=db, note_id=note_id, note_data=note)
    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Note with id={note_id} was not found.",
        )
    return updated


# ── DELETE ─────────────────────────────────────────────────────────────────

@app.delete(
    "/notes/{note_id}",
    status_code=status.HTTP_200_OK,
    tags=["Notes"],
)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """
    Delete a note by its ID.

    - **note_id**: Integer primary key of the note to delete
    """
    success = crud.delete_note(db=db, note_id=note_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Note with id={note_id} was not found.",
        )
    return {"message": f"Note with id={note_id} deleted successfully."}


# ── Run server (for direct execution) ─────────────────────────────────────
# Usage: python main.py
# Or (recommended): uvicorn main:app --reload

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
