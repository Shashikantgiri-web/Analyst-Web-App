"""
Database connection setup (SQLAlchemy 2.0, Supabase/PostgreSQL).
Every model and script in this project imports Base/engine/SessionLocal from here.
"""
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from config.settings import settings


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models."""
    pass


def get_engine():
    url = URL.create(
        drivername="postgresql+psycopg2",
        username=settings.DB_USER,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=settings.DB_NAME,
    )
    return create_engine(url, pool_pre_ping=True)


engine = get_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_session():
    """Yield a session, ensuring it's closed afterward."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
