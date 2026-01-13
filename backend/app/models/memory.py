from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db import Base

class UserMemory(Base):
    __tablename__ = "user_memories"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name_or_alias = Column(String, nullable=True)
    therapeutic_goal = Column(Text, nullable=True)
    preferred_exercises = Column(Text, nullable=True)  # JSON string
    last_emotional_state = Column(String, nullable=True)
    
    # Relationship
    user = relationship("User", back_populates="memory")