from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.chat import get_db
from app.models.user import User
from app.models.evaluation import Evaluation
from datetime import datetime

router = APIRouter()

class GAD7Request(BaseModel):
    question1: int  # Feeling nervous or anxious
    question2: int  # Not being able to stop worrying
    question3: int  # Worrying too much about different things
    question4: int  # Trouble relaxing
    question5: int  # Being so restless that it's hard to sit still
    question6: int  # Becoming easily annoyed or irritable
    question7: int  # Feeling afraid as if something awful might happen

class GAD7Response(BaseModel):
    score: int
    severity: str
    interpretation: str
    recommendations: List[str]
    evaluation_id: int

@router.post("/gad7/{user_id}", response_model=GAD7Response)
async def create_gad7_evaluation(user_id: int, request: GAD7Request, db: Session = Depends(get_db)):
    """Create and analyze GAD-7 anxiety evaluation"""
    
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate score
    score = (request.question1 + request.question2 + request.question3 + 
             request.question4 + request.question5 + request.question6 + request.question7)
    
    # Determine severity
    severity, interpretation, recommendations = _analyze_gad7_score(score)
    
    # Save evaluation
    evaluation = Evaluation(
        user_id=user_id,
        evaluation_type="GAD7",
        score=score,
        severity=severity,
        responses=[
            request.question1, request.question2, request.question3,
            request.question4, request.question5, request.question6, request.question7
        ],
        created_at=datetime.utcnow()
    )
    
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    
    return GAD7Response(
        score=score,
        severity=severity,
        interpretation=interpretation,
        recommendations=recommendations,
        evaluation_id=evaluation.id
    )

@router.get("/gad7/{user_id}/history")
async def get_gad7_history(user_id: int, db: Session = Depends(get_db)):
    """Get GAD-7 evaluation history for user"""
    
    evaluations = db.query(Evaluation).filter(
        Evaluation.user_id == user_id,
        Evaluation.evaluation_type == "GAD7"
    ).order_by(Evaluation.created_at.desc()).all()
    
    return [
        {
            "id": eval.id,
            "score": eval.score,
            "severity": eval.severity,
            "date": eval.created_at.isoformat()
        }
        for eval in evaluations
    ]

def _analyze_gad7_score(score: int):
    """Analyze GAD-7 score and return severity and recommendations"""
    
    if score <= 4:
        severity = "Mínima"
        interpretation = "Niveles de ansiedad mínimos. No parece requerir tratamiento específico."
        recommendations = [
            "Continuar con prácticas de bienestar",
            "Mantener hábitos saludables",
            "Reevaluar si los síntomas persisten o empeoran"
        ]
    elif score <= 9:
        severity = "Leve"
        interpretation = "Niveles de ansiedad leves. Podrían beneficiarse de técnicas de autoayuda."
        recommendations = [
            "Practicar ejercicios de respiración",
            "Técnicas de mindfulness",
            "Ejercicio regular",
            "Considerar hablar con un profesional si persiste"
        ]
    elif score <= 14:
        severity = "Moderada"
        interpretation = "Niveles de ansiedad moderados. Se recomienda intervención profesional."
        recommendations = [
            "Consultar con un profesional de salud mental",
            "Práctica regular de técnicas de relajación",
            "Considerar terapia cognitivo-conductual",
            "Ejercicios de grounding y mindfulness"
        ]
    else:
        severity = "Severa"
        interpretation = "Niveles de ansiedad severos. Se recomienda tratamiento profesional urgente."
        recommendations = [
            "Buscar ayuda profesional inmediatamente",
            "Considerar evaluación psiquiátrica",
            "Práctica intensiva de técnicas de manejo de ansiedad",
            "Apoyo familiar y social importante"
        ]
    
    return severity, interpretation, recommendations
