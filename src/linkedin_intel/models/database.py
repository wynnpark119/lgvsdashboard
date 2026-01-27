"""SQLAlchemy 데이터베이스 연결."""
from contextlib import contextmanager
from pathlib import Path
from typing import Generator
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker
from linkedin_intel.config import settings
from linkedin_intel.models.schema import Base, Query, Source, SourceType, Tag, SEED_QUERIES, SEED_TAGS


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


_engine = None
_SessionLocal = None


def get_db_path() -> Path:
    path = settings.db_path
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        _engine = create_engine(f"sqlite:///{get_db_path()}", connect_args={"check_same_thread": False})
    return _engine


def get_session_factory() -> sessionmaker:
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(bind=get_engine(), autoflush=False, autocommit=False)
    return _SessionLocal


@contextmanager
def get_session() -> Generator[Session, None, None]:
    session = get_session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db(force: bool = False) -> None:
    global _engine, _SessionLocal
    db_path = get_db_path()
    if force and db_path.exists():
        db_path.unlink()
        _engine = None
        _SessionLocal = None
    Base.metadata.create_all(get_engine())


def seed_data() -> None:
    with get_session() as session:
        for q in SEED_QUERIES:
            if not session.query(Query).filter(Query.name == q["name"]).first():
                session.add(Query(**q))
        for t in SEED_TAGS:
            if not session.query(Tag).filter(Tag.name == t["name"]).first():
                session.add(Tag(**t))
