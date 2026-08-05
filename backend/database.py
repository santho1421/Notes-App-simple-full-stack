# database.py
# ─────────────────────────────────────────────────────────────────────────────
# Sets up the SQLAlchemy engine and session for connecting to MySQL.
# ─────────────────────────────────────────────────────────────────────────────

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ── Connection config ──────────────────────────────────────────────────────
# Using URL.create() instead of a plain string so that special characters
# in the password (e.g. $, @, #) are automatically URL-encoded and never
# break the connection string parser.
DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username="root",
    password="SanthosH21",   # special chars are handled safely here
    host="localhost",
    database="notes_db",
)

# ── Engine ─────────────────────────────────────────────────────────────────
engine = create_engine(DATABASE_URL, echo=True)

# ── Session factory ────────────────────────────────────────────────────────
# autocommit=False  → changes are NOT saved until session.commit() is called
# autoflush=False   → objects are not flushed to the DB before every query
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Declarative base ───────────────────────────────────────────────────────
# All ORM models must inherit from this class.
Base = declarative_base()


# ── Dependency ─────────────────────────────────────────────────────────────
def get_db():
    """
    FastAPI dependency that provides a database session per request.
    The session is automatically closed after the request finishes,
    even if an exception occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
