"""
auth.py — versión final con Resend activado
────────────────────────────────────────────
Endpoints:
  POST /api/auth/register         — crea cuenta nueva
  POST /api/auth/login            — valida credenciales, devuelve JWT
  GET  /api/auth/me               — datos del usuario autenticado
  POST /api/auth/forgot-password  — envía email de recuperación via Resend
  POST /api/auth/reset-password   — restablece la contraseña con el token
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
from app.services.email_service import send_password_reset_email

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


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres.")
        return v


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
    Verifica el JWT del header Authorization: Bearer <token>.
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
    """Registro de nuevo usuario. Falla si el email ya está registrado."""
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
    Mensaje genérico para no revelar si el email existe.
    """
    _INVALID = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Correo o contraseña incorrectos.",
    )

    user = db.query(User).filter(User.email == request.email).first()

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


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(
    request: ForgotPasswordRequest, db: Session = Depends(get_db)
):
    """
    Genera un token de reset y envía el email via Resend.
    Siempre responde 200 OK sin revelar si el email existe.
    """
    user = db.query(User).filter(User.email == request.email).first()

    if user:
        # Token especial con purpose=reset, válido 30 minutos
        reset_token = create_access_token(
            data={
                "sub": user.email,
                "user_id": user.id,
                "purpose": "reset",
            },
            expires_delta=timedelta(minutes=30),
        )
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        await send_password_reset_email(to_email=user.email, reset_url=reset_url)

    return {
        "message": "Si existe una cuenta con ese correo, recibirás instrucciones pronto."
    }


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    request: ResetPasswordRequest, db: Session = Depends(get_db)
):
    """
    Restablece la contraseña usando el token recibido por email.
    Valida que el token sea válido, no esté expirado y tenga purpose=reset.
    """
    _INVALID = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="El enlace de recuperación es inválido o ya expiró.",
    )

    payload = verify_token(request.token)

    if payload is None:
        raise _INVALID

    # Verificar que el token es específicamente para reset (no un token de login)
    if payload.get("purpose") != "reset":
        raise _INVALID

    user_id: int = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise _INVALID

    user.hashed_password = hash_password(request.new_password)
    db.commit()

    return {"message": "Contraseña actualizada correctamente. Ya puedes iniciar sesión."}
