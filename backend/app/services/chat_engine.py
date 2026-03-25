from typing import List, Dict

from app.services.groq_client import groq_client

from app.services.exercise_selector import exercise_selector

from app.core.risk_detection import detect_risk, get_crisis_response

from app.prompts.system_prompt import SYSTEM_PROMPT

from app.prompts.safety_prompt import SAFETY_PROMPT



class ChatEngine:

    def __init__(self):

        pass

        

    async def process_message(self, user_message: str, user_memory: Dict = None) -> str:

        """

        Process user message and generate appropriate response.

        """

        # First check for risk
        if detect_risk(user_message):
            return get_crisis_response()
            
        # Detect anxiety keywords to suggest exercises
        if self._detect_anxiety(user_message):
            exercise = self._select_appropriate_exercise(user_memory)
            if exercise:
                exercise_text = self._format_exercise(exercise)
                # Get empathetic response with exercise
                context = self._prepare_context(user_memory)
                messages = [
                    {"role": "system", "content": SYSTEM_PROMPT + context + f"\n\nEjercicio recomendado:\n{exercise_text}"},
                    {"role": "user", "content": user_message}
                ]
            else:
                context = self._prepare_context(user_memory)
                messages = [
                    {"role": "system", "content": SYSTEM_PROMPT + context},
                    {"role": "user", "content": user_message}
                ]
        else:
            context = self._prepare_context(user_memory)
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT + context},
                {"role": "user", "content": user_message}
            ]
        
        # Get response from LLM
        response = await groq_client.chat_completion(messages)
        return response

        

    def _prepare_context(self, user_memory: Dict) -> str:

        """

        Prepare context string from user memory.

        """

        if not user_memory:

            return ""

            

        context_parts = []

        

        if user_memory.get("name_or_alias"):

            context_parts.append(f"Nombre del usuario: {user_memory['name_or_alias']}")

            

        if user_memory.get("therapeutic_goal"):

            context_parts.append(f"Objetivo terapéutico: {user_memory['therapeutic_goal']}")

            

        if user_memory.get("last_emotional_state"):

            context_parts.append(f"Último estado emocional: {user_memory['last_emotional_state']}")

            

        if user_memory.get("preferred_exercises"):

            context_parts.append(f"Ejercicios preferidos: {user_memory['preferred_exercises']}")

            

        if context_parts:

            return "\n\nContexto del usuario:\n" + "\n".join(context_parts)

            

        return ""

    

    def _detect_anxiety(self, user_message: str) -> bool:

        """Detect anxiety keywords in user message"""

        anxiety_keywords = [
            "ansiedad", "ansioso", "ansiosa", "nervioso", "nerviosa",
            "preocupado", "preocupada", "estresado", "estresada",
            "panico", "pánico", "ataque", "miedo", "temor",
            "angustia", "angustiado", "angustiada", "tenso", "tensa"
        ]
        
        return any(keyword in user_message.lower() for keyword in anxiety_keywords)
    
    def _select_appropriate_exercise(self, user_memory: Dict = None) -> Dict:
        """Select appropriate exercise based on user memory and preferences"""
        
        # Get all available exercises
        exercises = exercise_selector.get_all_exercises()
        
        if not exercises:
            return None
            
        # If user has preferred exercises, try to use those
        if user_memory and user_memory.get("preferred_exercises"):
            preferred = user_memory["preferred_exercises"].lower()
            for exercise in exercises:
                if preferred in exercise["category"].lower():
                    return exercise
        
        # Default selection logic: rotate through exercises
        import random
        return random.choice(exercises)
    
    def _format_exercise(self, exercise: Dict) -> str:
        """Format exercise for inclusion in response"""
        return f"""
EJERCICIO RECOMENDADO: {exercise['name']}
Categoría: {exercise['category']}
Descripción: {exercise['description']}
Instrucciones:
{exercise['instructions']}
"""



chat_engine = ChatEngine()