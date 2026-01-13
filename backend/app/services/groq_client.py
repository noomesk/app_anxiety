import httpx
from typing import Dict, Any
from backend.app.core.config import settings

class GroqClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1"
        self.model = "llama3-8b-8192"
        
    async def chat_completion(self, messages: list) -> str:
        """
        Send a chat completion request to Groq API.
        """
        if not self.api_key:
            return "Lo siento, el servicio de asistente no está disponible en este momento."
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"Error calling Groq API: {e}")
                return "Lo siento, estoy teniendo dificultades para responder en este momento. ¿Podrías intentarlo de nuevo?"

groq_client = GroqClient()