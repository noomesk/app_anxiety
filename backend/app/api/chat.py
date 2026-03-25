from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session

from pydantic import BaseModel

from typing import List, Optional

from app.db import get_db

from app.models.user import User

from app.models.message import Message

from app.models.memory import UserMemory

from app.services.chat_engine import chat_engine

from app.core.security import verify_token



router = APIRouter()



class MessageRequest(BaseModel):

    content: str

    user_id: int



class MessageResponse(BaseModel):

    content: str

    is_user: bool



class MemoryUpdateRequest(BaseModel):

    name_or_alias: Optional[str] = None

    therapeutic_goal: Optional[str] = None

    preferred_exercises: Optional[str] = None

    last_emotional_state: Optional[str] = None



def get_current_user(token: str, db: Session):

    payload = verify_token(token)

    if payload is None:

        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == payload.get("user_id")).first()

    if user is None:

        raise HTTPException(status_code=401, detail="User not found")

    return user



@router.post("/message", response_model=MessageResponse)

async def send_message(request: MessageRequest, db: Session = Depends(get_db)):

    # Get user

    user = db.query(User).filter(User.id == request.user_id).first()

    if not user:

        raise HTTPException(status_code=404, detail="User not found")

    

    # Save user message

    user_message = Message(

        user_id=request.user_id,

        content=request.content,

        is_user=True

    )

    db.add(user_message)

    db.commit()

    

    # Get user memory

    user_memory = db.query(UserMemory).filter(UserMemory.user_id == request.user_id).first()
    memory_dict = None
    if user_memory:
        memory_dict = {
            "name_or_alias": user_memory.name_or_alias,
            "therapeutic_goal": user_memory.therapeutic_goal,
            "preferred_exercises": user_memory.preferred_exercises,
            "last_emotional_state": user_memory.last_emotional_state
        }
    
    # Process message with chat engine
    bot_response = await chat_engine.process_message(request.content, memory_dict)

    

    # Save bot response

    bot_message = Message(

        user_id=request.user_id,

        content=bot_response,

        is_user=False

    )

    db.add(bot_message)

    db.commit()

    

    # Update user memory dynamically based on message content

    await _update_user_memory(request.user_id, request.content, db)

    

    return MessageResponse(content=bot_response, is_user=False)



@router.get("/history/{user_id}", response_model=List[MessageResponse])

async def get_chat_history(user_id: int, db: Session = Depends(get_db)):

    messages = db.query(Message).filter(Message.user_id == user_id).order_by(Message.timestamp).all()

    return [

        MessageResponse(

            content=msg.content,

            is_user=msg.is_user

        )

        for msg in messages

    ]



@router.put("/memory/{user_id}")

async def update_user_memory(user_id: int, request: MemoryUpdateRequest, db: Session = Depends(get_db)):

    # Check if user exists

    user = db.query(User).filter(User.id == user_id).first()

    if not user:

        raise HTTPException(status_code=404, detail="User not found")

    

    # Get or create user memory

    user_memory = db.query(UserMemory).filter(UserMemory.user_id == user_id).first()

    if not user_memory:

        user_memory = UserMemory(user_id=user_id)

        db.add(user_memory)

    

    # Update fields if provided

    if request.name_or_alias is not None:

        user_memory.name_or_alias = request.name_or_alias

    if request.therapeutic_goal is not None:

        user_memory.therapeutic_goal = request.therapeutic_goal

    if request.preferred_exercises is not None:

        user_memory.preferred_exercises = request.preferred_exercises

    if request.last_emotional_state is not None:

        user_memory.last_emotional_state = request.last_emotional_state

    

    db.commit()

    db.refresh(user_memory)

    

    return {"message": "Memory updated successfully"}


async def _update_user_memory(user_id: int, message_content: str, db: Session):
    """Update user memory dynamically based on message content"""
    
    # Get or create user memory
    user_memory = db.query(UserMemory).filter(UserMemory.user_id == user_id).first()
    if not user_memory:
        user_memory = UserMemory(user_id=user_id)
        db.add(user_memory)
    
    # Detect emotional state from message
    emotional_state = _detect_emotional_state(message_content)
    if emotional_state:
        user_memory.last_emotional_state = emotional_state
    
    # Extract name if mentioned
    name = _extract_name(message_content)
    if name and not user_memory.name_or_alias:
        user_memory.name_or_alias = name
    
    # Detect exercise preferences
    exercise_preference = _detect_exercise_preference(message_content)
    if exercise_preference:
        user_memory.preferred_exercises = exercise_preference
    
    db.commit()


def _detect_emotional_state(message: str) -> str:
    """Detect emotional state from message content"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["feliz", "contento", "alegre", "bien"]):
        return "positivo"
    elif any(word in message_lower for word in ["triste", "deprimido", "mal", "abajo"]):
        return "negativo"
    elif any(word in message_lower for word in ["ansioso", "nervioso", "preocupado", "tenso"]):
        return "ansioso"
    elif any(word in message_lower for word in ["calmado", "relajado", "tranquilo", "paz"]):
        return "calmado"
    
    return None


def _extract_name(message: str) -> str:
    """Extract user name from message"""
    import re
    
    # Simple pattern: "me llamo [nombre]" or "soy [nombre]"
    patterns = [
        r"me llamo\s+(\w+)",
        r"soy\s+(\w+)",
        r"mi nombre es\s+(\w+)"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, message.lower())
        if match:
            return match.group(1).capitalize()
    
    return None


def _detect_exercise_preference(message: str) -> str:
    """Detect exercise preferences from message"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["respirar", "respiración", "respirar"]):
        return "respiracion"
    elif any(word in message_lower for word in ["grounding", "sentidos", "5-4-3-2-1"]):
        return "grounding"
    elif any(word in message_lower for word in ["relajar", "relajación", "muscular"]):
        return "relajacion"
    elif any(word in message_lower for word in ["pensamientos", "cognitivo", "reevaluación"]):
        return "cognitivo"
    
    return None