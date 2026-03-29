"""
chat_engine.py
──────────────
Motor de conversación de Brotito.

Cambio clave vs versión anterior:
  process_message() ahora recibe user_id (int) en lugar de session_id (str).
  El historial se indexa por user_id, así cada paciente tiene
  su propia memoria de conversación completamente separada.
"""

from typing import List, Dict, Optional

from app.services.groq_client import groq_client
from app.services.exercise_selector import exercise_selector
from app.core.risk_detection import detect_risk, get_crisis_response
from app.prompts.system_prompt import SYSTEM_PROMPT


ANXIETY_HIGH_KEYWORDS = [
    "no puedo respirar", "me ahogo", "corazón acelerado", "temblores", "pánico",
    "panico", "ataque de pánico", "ataque de panico", "no puedo más", "no puedo mas",
    "me desbordo", "estoy colapsando", "siento que me voy a desmayar",
    "me estoy volviendo loca", "me estoy volviendo loco", "ya no aguanto",
    "no puedo pensar", "estoy bloqueada", "estoy bloqueado", "ayudame a regular",
    "ayúdame a regular", "necesito calmarme ahora", "bájame la ansiedad",
    "bajame la ansiedad", "estoy muy ansioso ahora", "estoy muy ansiosa ahora",
]

ANXIETY_MEDIUM_KEYWORDS = [
    "ansiedad", "ansioso", "ansiosa", "nervioso", "nerviosa",
    "preocupado", "preocupada", "estresado", "estresada",
    "angustia", "angustiado", "angustiada", "tenso", "tensa",
    "me preocupa", "me genera ansiedad", "me pone ansioso", "me pone ansiosa",
    "me da miedo", "temor", "inquieto", "inquieta",
]

ANXIETY_LOW_KEYWORDS = [
    "cansado", "cansada", "frustrado", "frustrada", "aburrido", "aburrida",
    "triste", "bajoneado", "bajoneada", "sin energía", "sin energia",
    "no tengo ganas", "agotado", "agotada",
]

FALSE_POSITIVE_PHRASES = [
    "no tiene sentido ir", "no tiene sentido hacer", "no tiene sentido que",
    "esto no tiene sentido", "eso no tiene sentido",
    "me muero de risa", "me muero de vergüenza", "me muero de hambre",
    "me muero de sueño", "me mato de risa", "me mato trabajando",
    "mato el tiempo", "matando el tiempo",
    "quiero morir de la vergüenza", "quiero morir de risa",
    "crisis económica", "crisis laboral", "crisis de ansiedad",
    "crisis de estrés", "crisis de pareja", "crisis académica",
]


def _classify_anxiety_level(message: str) -> str:
    text = message.lower()
    if any(kw in text for kw in ANXIETY_HIGH_KEYWORDS):
        return "alto"
    if any(kw in text for kw in ANXIETY_MEDIUM_KEYWORDS):
        return "medio"
    if any(kw in text for kw in ANXIETY_LOW_KEYWORDS):
        return "bajo"
    return "ninguno"


def _is_real_crisis(message: str) -> bool:
    text = message.lower()
    for phrase in FALSE_POSITIVE_PHRASES:
        if phrase in text:
            return False
    return detect_risk(message)


class ChatEngine:
    def __init__(self):
        # Historial indexado por user_id: { user_id: [ {role, content} ] }
        self._histories: Dict[int, List[Dict]] = {}

    async def process_message(
        self,
        user_message: str,
        user_id: int,
        user_memory: Optional[Dict] = None,
    ) -> str:
        if _is_real_crisis(user_message):
            return get_crisis_response()

        anxiety_level = _classify_anxiety_level(user_message)
        system_content = self._build_system_prompt(anxiety_level, user_memory)

        history = self._histories.setdefault(user_id, [])
        history.append({"role": "user", "content": user_message})

        messages_for_llm = [{"role": "system", "content": system_content}] + history
        response_text = await groq_client.chat_completion(messages_for_llm)

        history.append({"role": "assistant", "content": response_text})

        if len(history) > 40:
            self._histories[user_id] = history[-40:]

        return response_text

    def clear_session(self, user_id: int) -> None:
        self._histories.pop(user_id, None)

    def _build_system_prompt(self, anxiety_level: str, user_memory: Optional[Dict]) -> str:
        parts = [SYSTEM_PROMPT]
        context = self._prepare_context(user_memory)
        if context:
            parts.append(context)
        if anxiety_level != "ninguno":
            parts.append(f"\n[NIVEL DE ANSIEDAD DETECTADO: {anxiety_level}]")
        if anxiety_level == "alto":
            exercise = self._select_appropriate_exercise(user_memory)
            if exercise:
                parts.append(self._format_exercise_for_prompt(exercise))
        return "\n".join(parts)

    def _prepare_context(self, user_memory: Optional[Dict]) -> str:
        if not user_memory:
            return ""
        parts = []
        if user_memory.get("name_or_alias"):
            parts.append(f"Nombre del usuario: {user_memory['name_or_alias']}")
        if user_memory.get("therapeutic_goal"):
            parts.append(f"Objetivo terapéutico: {user_memory['therapeutic_goal']}")
        if user_memory.get("last_emotional_state"):
            parts.append(f"Último estado emocional: {user_memory['last_emotional_state']}")
        if user_memory.get("preferred_exercises"):
            parts.append(f"Ejercicios preferidos: {user_memory['preferred_exercises']}")
        return "\n\nContexto del usuario:\n" + "\n".join(parts) if parts else ""

    def _select_appropriate_exercise(self, user_memory: Optional[Dict] = None) -> Optional[Dict]:
        exercises = exercise_selector.get_all_exercises()
        if not exercises:
            return None
        if user_memory and user_memory.get("preferred_exercises"):
            preferred = user_memory["preferred_exercises"].lower()
            for ex in exercises:
                if preferred in ex.get("category", "").lower():
                    return ex
        import random
        return random.choice(exercises)

    def _format_exercise_for_prompt(self, exercise: Dict) -> str:
        return f"""
EJERCICIO PARA GUIAR:
Nombre: {exercise['name']}
Categoría: {exercise['category']}
Descripción: {exercise['description']}
Instrucciones:
{exercise['instructions']}

INSTRUCCIÓN: Presenta este ejercicio de forma calmada y amigable, como si lo
hicieras junto al usuario. Guíalo paso a paso sin llamarlo 'ejercicio terapéutico'.
Después pregunta cómo se siente."""


chat_engine = ChatEngine()
