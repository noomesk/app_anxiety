from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db import get_db
from app.models.user import User
from app.core.security import create_access_token
from app.core.config import settings
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == request.email).first()
    
    # If user doesn't exist, create them
    if not user:
        user = User(email=request.email)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }