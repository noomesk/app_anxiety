"""
Configuración para Vercel - Base de datos persistente
"""
import os

# Configuración específica para Vercel
class VercelSettings:
    # Base de datos persistente en /tmp
    DATABASE_URL: str = "file:///tmp/test.db"
    
    # URLs de producción
    FRONTEND_URL: str = "https://tu-app.vercel.app"
    
    # API Keys (deben configurarse en Vercel)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")

# Instancia global
vercel_settings = VercelSettings()
