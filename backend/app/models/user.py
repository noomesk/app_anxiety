from sqlalchemy import Column, Integer, String, DateTime, Text

from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.db import Base



class User(Base):

    __tablename__ = "users"

    

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, index=True)

    alias = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    

    # Relationships

    messages = relationship("Message", back_populates="user")

    memory = relationship("UserMemory", back_populates="user", uselist=False)

    evaluations = relationship("Evaluation", back_populates="user")

    

    def __repr__(self):

        return f"<User(id={self.id}, email={self.email})>"