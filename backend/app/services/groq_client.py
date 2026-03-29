"""
groq_client.py
──────────────
Cliente para la API de Groq.

Cambios respecto a la versión anterior:
- Modelo actualizado a llama-3.3-70b-versatile: más capaz de seguir instrucciones
  complejas de sistema (niveles de ansiedad, ejercicios guiados, conversación empática).
- Bug corregido en el bloque except: 'response' puede no existir si el error
  ocurre antes de recibir respuesta (timeout, DNS). Ahora se maneja correctamente.
- Temperature bajada a 0.6: reduce respuestas inventadas o incoherentes,
  mantiene calidez sin perder precisión en las instrucciones.
- Logging mejorado: muestra el tipo de error para facilitar debugging.
"""

import httpx
from typing import List, Dict
from app.core.config import settings


class GroqClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1"

        # llama-3.3-70b-versatile:
        #   - Sigue instrucciones de sistema complejas con alta fidelidad
        #   - Sigue siendo muy rápido en Groq (latencia baja)
        #   - Mejor que 8b para conversación empática con matices
        self.model = "llama-3.3-70b-versatile"

    async def chat_completion(self, messages: List[Dict]) -> str:
        """
        Envía una solicitud de chat completion a la API de Groq.
        Retorna el texto de respuesta, o un mensaje de error amigable si falla.
        """
        if not self.api_key:
            return (
                "El servicio no está disponible en este momento. "
                "Por favor avísale a tu psicóloga para que lo revise."
            )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.6,   # Más coherente; 0.7+ genera más divagaciones
            "max_tokens": 500,
        }

        response = None  # Inicializar para que el except siempre pueda referenciarlo

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=30.0,
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]

            except httpx.TimeoutException:
                print("[GroqClient] Timeout: la API no respondió en 30 segundos.")
                return (
                    "Tardé demasiado en responder. ¿Puedes intentarlo de nuevo?"
                )

            except httpx.HTTPStatusError as e:
                status = e.response.status_code if e.response else "desconocido"
                body = e.response.text if e.response else "sin cuerpo"
                print(f"[GroqClient] HTTP {status}: {body}")
                return (
                    "Tuve un problema técnico al responder. ¿Puedes intentarlo de nuevo?"
                )

            except Exception as e:
                status = response.status_code if response is not None else "sin respuesta"
                body = response.text if response is not None else "sin cuerpo"
                print(f"[GroqClient] Error inesperado: {type(e).__name__}: {e}")
                print(f"  Status: {status} | Body: {body}")
                return (
                    "Tuve un problema técnico al responder. ¿Puedes intentarlo de nuevo?"
                )


groq_client = GroqClient()
