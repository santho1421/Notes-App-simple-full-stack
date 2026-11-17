# database.py
# ─────────────────────────────────────────────────────────────────────────────
# Sets up the SQLAlchemy engine and session for connecting to MySQL.
# ─────────────────────────────────────────────────────────────────────────────

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from a .env file if present
load_dotenv()

# ── Connection config ──────────────────────────────────────────────────────
# Supports cloud deployment (via DATABASE_URL or individual DB_* env vars)
# with local fallback.
raw_db_url = os.getenv("DATABASE_URL")

if raw_db_url:
    # Ensure mysql+pymysql driver is specified if provided as mysql://
    if raw_db_url.startswith("mysql://"):
        raw_db_url = raw_db_url.replace("mysql://", "mysql+pymysql://", 1)
    DATABASE_URL = raw_db_url
else:
    db_user = os.getenv("DB_USER", "root")
    db_pass = os.getenv("DB_PASSWORD", "SanthosH21")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_name = os.getenv("DB_NAME", "notes_db")

    DATABASE_URL = URL.create(
        drivername="mysql+pymysql",
        username=db_user,
        password=db_pass,
        host=db_host,
        port=db_port,
        database=db_name,
    )

# ── Engine configuration ──────────────────────────────────────────────────
connect_args = {}
if os.getenv("DB_SSL", "false").lower() in ("true", "1", "yes"):
    connect_args["ssl"] = {"ssl_mode": "REQUIRED"}

# pool_pre_ping=True is essential for serverless platforms like Vercel
# to automatically recover if an idle connection was closed by the DB server.
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_ECHO", "false").lower() in ("true", "1", "yes"),
    pool_pre_ping=True,
    connect_args=connect_args,
)

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
