from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean

from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from backend.app.db import Base



class Message(Base):

    __tablename__ = "messages"

    

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    content = Column(Text)

    is_user = Column(Boolean)  # True if from user, False if from bot

    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    

    # Relationship

    user = relationship("User", back_populates="messages")