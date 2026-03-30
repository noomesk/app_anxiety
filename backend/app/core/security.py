"""
security.py
───────────
Utilidades de seguridad: hashing de contraseñas y JWT.

Dependencias nuevas necesarias:
  pip install bcrypt passlib[bcrypt]

(python-jose ya estaba instalado para JWT)
"""

from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
import bcrypt
from .config import settings

# ── Hashing de contraseñas ────────────────────────────────────
# Usamos bcrypt directamente para evitar incompatibilidades con passlib

def hash_password(plain_password: str) -> str:
    """Devuelve el hash bcrypt de una contraseña en texto plano."""
    # Bcrypt maneja el salting automáticamente
    password_bytes = plain_password.encode("utf-8")
    # Truncar a 72 si es necesario (limite de bcrypt) para consistencia
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara una contraseña en texto plano con su hash almacenado."""
    password_bytes = plain_password.encode("utf-8")
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    try:
        return bcrypt.checkpw(password_bytes, hashed_password.encode("utf-8"))
    except Exception:
        return False


# ── JWT ───────────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Genera un JWT firmado con los datos proporcionados."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    """
    Decodifica y valida un JWT.
    Devuelve el payload si es válido, None si está expirado o es inválido.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
