"""
db.py
─────
Configuración de SQLAlchemy + SQLite.

Cambio respecto a la versión anterior:
  init_db() ahora importa todos los modelos desde un solo punto
  en lugar de importarlos uno a uno. Si agregas un modelo nuevo,
  solo necesitas importarlo en app/models/__init__.py y aquí
  se creará la tabla automáticamente.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},  # necesario para SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db() -> None:
    """
    Crea todas las tablas definidas en los modelos.
    Los modelos se importan desde app/models/__init__.py
    para que SQLAlchemy los registre antes de crear las tablas.
    """
    import app.models  # noqa: F401 — dispara los imports de todos los modelos
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependencia FastAPI para inyectar una sesión de DB por request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
