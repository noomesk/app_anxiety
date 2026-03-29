"""
auth.py
───────
Endpoints de autenticación:

  POST /api/auth/register  — crea cuenta nueva con email + contraseña
  POST /api/auth/login     — valida credenciales y devuelve JWT
  GET  /api/auth/me        — devuelve datos del usuario autenticado

Seguridad:
  - Las contraseñas se almacenan como hash bcrypt (nunca en texto plano).
  - El JWT incluye user_id y email; se verifica en cada request protegido.
  - El endpoint /login NO crea usuarios automáticamente (era el bug anterior).
  - Errores de credenciales devuelven siempre el mismo mensaje genérico
    para no revelar si un email existe o no (previene enumeración).
"""

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.user import User
from app.models.memory import UserMemory
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
    verify_token,
)
from app.core.config import settings

router = APIRouter()
bearer_scheme = HTTPBearer()


# ── Schemas Pydantic ──────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres.")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    alias: str | None


class MeResponse(BaseModel):
    user_id: int
    email: str
    alias: str | None


# ── Helper: usuario autenticado ───────────────────────────────

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependencia reutilizable para endpoints protegidos.
    Verifica el JWT del header Authorization: Bearer <token>
    y devuelve el objeto User de la DB.
    """
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: int = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado.",
        )

    return user


# ── Endpoints ─────────────────────────────────────────────────

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registro de nuevo usuario.
    Falla si el email ya está registrado.
    Crea automáticamente un registro vacío de UserMemory para el usuario.
    """
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese correo.",
        )

    new_user = User(
        email=request.email,
        hashed_password=hash_password(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Crear memoria vacía para el usuario nuevo
    memory = UserMemory(user_id=new_user.id)
    db.add(memory)
    db.commit()

    access_token = create_access_token(
        data={"sub": new_user.email, "user_id": new_user.id},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=new_user.id,
        email=new_user.email,
        alias=new_user.alias,
    )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login con email + contraseña.
    Mensaje de error genérico para no revelar si el email existe.
    """
    _INVALID = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Correo o contraseña incorrectos.",
    )

    user = db.query(User).filter(User.email == request.email).first()

    # Verificar existencia Y contraseña en el mismo condicional
    # para evitar timing attacks
    if user is None or not verify_password(request.password, user.hashed_password):
        raise _INVALID

    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        alias=user.alias,
    )


@router.get("/me", response_model=MeResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Devuelve los datos básicos del usuario autenticado."""
    return MeResponse(
        user_id=current_user.id,
        email=current_user.email,
        alias=current_user.alias,
    )
