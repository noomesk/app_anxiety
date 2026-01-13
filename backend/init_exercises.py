from app.db import init_db, SessionLocal
from app.models.exercise import Exercise

def init_exercises():
    db = SessionLocal()
    
    # Check if exercises already exist
    existing = db.query(Exercise).first()
    if existing:
        print("Exercises already exist in database")
        return
    
    exercises = [
        {
            "name": "Respiración 4-7-8",
            "description": "Técnica de respiración para calmar el sistema nervioso",
            "instructions": "1. Inhala profundamente por la nariz contando hasta 4\n2. Mantén el aire contando hasta 7\n3. Exhala lentamente por la boca contando hasta 8\n4. Repite 3-4 veces",
            "category": "respiracion"
        },
        {
            "name": "Grounding 5-4-3-2-1",
            "description": "Ejercicio para conectar con el presente",
            "instructions": "Identifica:\n1. 5 cosas que puedes ver\n2. 4 cosas que puedes tocar\n3. 3 cosas que puedes oír\n4. 2 cosas que puedes oler\n5. 1 cosa que puedes saborear",
            "category": "grounding"
        },
        {
            "name": "Relajación Muscular Progresiva",
            "description": "Técnica para liberar tensión física",
            "instructions": "1. Comienza con los pies, tensa los músculos durante 5 segundos\n2. Relaja completamente durante 10 segundos\n3. Sube progresivamente por el cuerpo: piernas, abdomen, brazos, manos, hombros, cuello, cara\n4. Presta atención a la diferencia entre tensión y relajación",
            "category": "relajacion"
        },
        {
            "name": "Reencuadre Cognitivo",
            "description": "Ejercicio para cambiar perspectivas negativas",
            "instructions": "1. Identifica el pensamiento automático negativo\n2. Pregúntate: ¿Es este pensamiento un hecho o una interpretación?\n3. Busca evidencia a favor y en contra de este pensamiento\n4. Formula una perspectiva más equilibrada",
            "category": "cognitivo"
        }
    ]
    
    for ex in exercises:
        exercise = Exercise(**ex)
        db.add(exercise)
    
    db.commit()
    print("Exercises added to database")

if __name__ == "__main__":
    init_db()
    init_exercises()