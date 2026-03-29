"""
exercise_selector.py
────────────────────
Selector de ejercicios desde la base de datos.

Cambios respecto a la versión anterior:
- La sesión de DB se abre y cierra dentro de cada método (evita memory leaks y locks).
- Manejo de errores en todas las consultas: si la DB falla o está vacía,
  los métodos devuelven [] o None en lugar de lanzar excepciones no capturadas.
- Se elimina la sesión persistente en __init__.
"""

from typing import List, Dict, Optional
from app.models.exercise import Exercise
from app.db import SessionLocal


class ExerciseSelector:

    def get_all_exercises(self) -> List[Dict]:
        """
        Devuelve todos los ejercicios disponibles en la base de datos.
        Retorna lista vacía si hay error o si no hay ejercicios.
        """
        db = SessionLocal()
        try:
            exercises = db.query(Exercise).all()
            return [self._to_dict(e) for e in exercises]
        except Exception as ex:
            print(f"[ExerciseSelector] Error consultando ejercicios: {ex}")
            return []
        finally:
            db.close()

    def get_exercise_by_id(self, exercise_id: int) -> Optional[Dict]:
        """
        Devuelve un ejercicio por ID, o None si no existe.
        """
        db = SessionLocal()
        try:
            exercise = (
                db.query(Exercise)
                .filter(Exercise.id == exercise_id)
                .first()
            )
            return self._to_dict(exercise) if exercise else None
        except Exception as ex:
            print(f"[ExerciseSelector] Error buscando ejercicio id={exercise_id}: {ex}")
            return None
        finally:
            db.close()

    def get_exercise_by_name(self, name: str) -> Optional[Dict]:
        """
        Devuelve un ejercicio por nombre (búsqueda exacta), o None si no existe.
        """
        db = SessionLocal()
        try:
            exercise = (
                db.query(Exercise)
                .filter(Exercise.name == name)
                .first()
            )
            return self._to_dict(exercise) if exercise else None
        except Exception as ex:
            print(f"[ExerciseSelector] Error buscando ejercicio name='{name}': {ex}")
            return None
        finally:
            db.close()

    def get_exercises_by_category(self, category: str) -> List[Dict]:
        """
        Devuelve todos los ejercicios de una categoría dada.
        Útil para seleccionar ejercicios según el nivel de ansiedad.
        """
        db = SessionLocal()
        try:
            exercises = (
                db.query(Exercise)
                .filter(Exercise.category.ilike(f"%{category}%"))
                .all()
            )
            return [self._to_dict(e) for e in exercises]
        except Exception as ex:
            print(f"[ExerciseSelector] Error buscando categoría='{category}': {ex}")
            return []
        finally:
            db.close()

    # ── Helper privado ───────────────────────────────────────

    @staticmethod
    def _to_dict(exercise: Exercise) -> Dict:
        return {
            "id": exercise.id,
            "name": exercise.name,
            "description": exercise.description,
            "instructions": exercise.instructions,
            "category": exercise.category,
        }


exercise_selector = ExerciseSelector()
