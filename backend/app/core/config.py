import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Anxiety Companion"
    PROJECT_VERSION: str = "0.1.0"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Groq API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Risk detection keywords
    RISK_KEYWORDS: list = [
        "suicidio", "suicidarme", "matarme", "no quiero vivir",
        "no tiene sentido", "desesperanza", "crisis", "extrema tristeza"
    ]

settings = Settings()