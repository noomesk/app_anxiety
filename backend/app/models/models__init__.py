# app/models/__init__.py
# ─────────────────────
# Importa todos los modelos para que SQLAlchemy los registre
# en Base.metadata antes de crear las tablas con init_db().
#
# Si agregas un modelo nuevo, impórtalo aquí.

from app.models.user import User           # noqa: F401
from app.models.message import Message     # noqa: F401
from app.models.memory import UserMemory   # noqa: F401
from app.models.exercise import Exercise   # noqa: F401
