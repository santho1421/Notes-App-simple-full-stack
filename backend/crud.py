# crud.py
# ─────────────────────────────────────────────────────────────────────────────
# CRUD helper functions that interact with the database via SQLAlchemy.
# Each function receives a db session and the data it needs, then returns
# the result to the route handler in main.py.
# ─────────────────────────────────────────────────────────────────────────────

from sqlalchemy.orm import Session
from models import Note
from schemas import NoteCreate, NoteUpdate


# ── CREATE ─────────────────────────────────────────────────────────────────

def create_note(db: Session, note: NoteCreate) -> Note:
    """
    Insert a new note into the database.

    Args:
        db   : active database session
        note : validated NoteCreate schema containing the message

    Returns:
        The newly created Note ORM object (with id populated).
    """
    db_note = Note(message=note.message)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)   # load the auto-generated id back into the object
    return db_note


# ── READ ALL ───────────────────────────────────────────────────────────────

def get_all_notes(db: Session) -> list[Note]:
    """
    Retrieve every note from the database ordered by id (oldest first).

    Args:
        db : active database session

    Returns:
        A list of Note ORM objects (can be empty).
    """
    return db.query(Note).order_by(Note.id).all()


# ── READ ONE ───────────────────────────────────────────────────────────────

def get_note_by_id(db: Session, note_id: int) -> Note | None:
    """
    Fetch a single note by its primary key.

    Args:
        db      : active database session
        note_id : the note's integer id

    Returns:
        A Note ORM object, or None if not found.
    """
    return db.query(Note).filter(Note.id == note_id).first()


# ── UPDATE ─────────────────────────────────────────────────────────────────

def update_note(db: Session, note_id: int, note_data: NoteUpdate) -> Note | None:
    """
    Update the message of an existing note.

    Args:
        db        : active database session
        note_id   : the note's integer id
        note_data : validated NoteUpdate schema with the new message

    Returns:
        The updated Note ORM object, or None if the note was not found.
    """
    db_note = get_note_by_id(db, note_id)
    if db_note is None:
        return None

    db_note.message = note_data.message
    db.commit()
    db.refresh(db_note)
    return db_note


# ── DELETE ─────────────────────────────────────────────────────────────────

def delete_note(db: Session, note_id: int) -> bool:
    """
    Remove a note from the database.

    Args:
        db      : active database session
        note_id : the note's integer id

    Returns:
        True if the note was found and deleted, False otherwise.
    """
    db_note = get_note_by_id(db, note_id)
    if db_note is None:
        return False

    db.delete(db_note)
    db.commit()
    return True
