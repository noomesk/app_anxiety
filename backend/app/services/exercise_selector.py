from typing import List, Dict
from app.models.exercise import Exercise
from app.db import SessionLocal

class ExerciseSelector:
    def __init__(self):
        self.db = SessionLocal()
        
    def get_all_exercises(self) -> List[Dict]:
        """Get all available exercises from database."""
        exercises = self.db.query(Exercise).all()
        return [
            {
                "id": exercise.id,
                "name": exercise.name,
                "description": exercise.description,
                "instructions": exercise.instructions,
                "category": exercise.category
            }
            for exercise in exercises
        ]
        
    def get_exercise_by_id(self, exercise_id: int) -> Dict:
        """Get a specific exercise by ID."""
        exercise = self.db.query(Exercise).filter(Exercise.id == exercise_id).first()
        if exercise:
            return {
                "id": exercise.id,
                "name": exercise.name,
                "description": exercise.description,
                "instructions": exercise.instructions,
                "category": exercise.category
            }
        return None
        
    def get_exercise_by_name(self, name: str) -> Dict:
        """Get a specific exercise by name."""
        exercise = self.db.query(Exercise).filter(Exercise.name == name).first()
        if exercise:
            return {
                "id": exercise.id,
                "name": exercise.name,
                "description": exercise.description,
                "instructions": exercise.instructions,
                "category": exercise.category
            }
        return None

exercise_selector = ExerciseSelector()