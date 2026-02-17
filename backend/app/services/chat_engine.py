from typing import List, Dict

from backend.app.services.groq_client import groq_client

from backend.app.services.exercise_selector import exercise_selector

from backend.app.core.risk_detection import detect_risk, get_crisis_response

from backend.app.prompts.system_prompt import SYSTEM_PROMPT

from backend.app.prompts.safety_prompt import SAFETY_PROMPT



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

            

        # Prepare context with user memory

        context = self._prepare_context(user_memory)

        

        # Prepare messages for LLM

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



chat_engine = ChatEngine()