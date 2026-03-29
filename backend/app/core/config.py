import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Anxiety Companion"
    PROJECT_VERSION: str = "0.1.0"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    # Security
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "your-secret-key-change-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Groq API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # ──────────────────────────────────────────────────────────
    # NOTA: La detección de riesgo ya NO usa una lista de keywords
    # simple aquí. Toda la lógica vive en:
    #   app/core/risk_detection.py
    #
    # Las listas HIGH_PRECISION_KEYWORDS y FALSE_POSITIVE_PHRASES
    # en ese archivo son la fuente de verdad.
    # No agregues keywords aquí — edita risk_detection.py directamente.
    # ──────────────────────────────────────────────────────────


settings = Settings()
