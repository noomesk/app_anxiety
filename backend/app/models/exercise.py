from sqlalchemy import Column, Integer, String, Text
from app.db import Base

class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(Text)
    instructions = Column(Text)
    category = Column(String)  # breathing, grounding, etc.
    
    def __repr__(self):
        return f"<Exercise(id={self.id}, name={self.name})>"