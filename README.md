# Anxiety Companion App

Una aplicación de acompañamiento emocional para personas con ansiedad, diseñada para usarse entre sesiones terapéuticas bajo supervisión de un profesional.

## Características

- Chat empático con inteligencia artificial
- Ejercicios terapéuticos basados en TCC y mindfulness
- Validación emocional en tiempo real
- Detección de riesgo y respuestas de seguridad
- Historial de conversaciones
- Interfaz cálida y no clínica

## Arquitectura

### Backend (FastAPI)
- Python 3.11
- FastAPI para la API REST
- SQLAlchemy con SQLite (beta)
- Integración con Groq API (LLM)
- Autenticación JWT simple
- Sistema de memoria de usuario
- Detección de riesgo

### Frontend (React)
- React con Vite
- Interfaz tipo chat
- Diseño limpio y humano
- Botón de emergencia "Estoy muy ansioso ahora"

## Requisitos

- Python 3.11+
- Node.js 16+
- npm o yarn
- Cuenta en Groq (para API key)

## Instalación

### Backend

1. Crear un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install fastapi uvicorn python-jose python-multipart sqlalchemy databases[sqlite] httpx python-dotenv
```

3. Crear archivo `.env` en la raíz del proyecto:
```env
SECRET_KEY=tu_clave_secreta_segura
GROQ_API_KEY=tu_api_key_de_groq
```

4. Iniciar el servidor:
```bash
cd backend/app
python main.py
```

### Frontend

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar la aplicación:
```bash
npm run dev
```

## Uso

1. Accede a la aplicación en `http://localhost:5173`
2. Inicia sesión con tu correo electrónico
3. Comienza a conversar con el asistente
4. Usa el botón "Estoy muy ansioso ahora" para situaciones de crisis

## Desarrollado por

noomesk 2026 - Todos los derechos reservados

## Nota

Esta aplicación es un acompañamiento entre sesiones terapéuticas, no reemplaza la terapia profesional.