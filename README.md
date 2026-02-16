# Anxiety Companion App

Una aplicación de acompañamiento emocional para personas con ansiedad, diseñada para usarse entre sesiones terapéuticas bajo supervisión de un profesional.

## Estado Actual de la Aplicación

### Funcionalidades Completamente Operativas (100%)
- Chat empático en tiempo real con IA
- Autenticación JWT con email simple
- Detección de crisis con palabras clave
- Respuestas de seguridad predefinidas
- Historial completo de conversaciones
- Memoria contextual del usuario
- 4 ejercicios terapéuticos pre-cargados
- Botón de emergencia "Estoy muy ansioso ahora"
- Persistencia de datos en SQLite
- API REST completa con FastAPI

---

## Arquitectura Detallada

### Backend (FastAPI) - Python 3.14
Estructura del Backend:
backend/
├── app/
│   ├── api/                    # Endpoints REST
│   │   ├── auth.py           # Login y JWT
│   │   └── chat.py           # Chat, historial, memoria
│   ├── core/
│   │   ├── config.py         # Variables de entorno
│   │   ├── security.py       # JWT tokens
│   │   └── risk_detection.py # Detección de crisis
│   ├── models/                 # SQLAlchemy ORM
│   │   ├── user.py          # Modelo Usuario
│   │   ├── message.py       # Modelo Mensaje
│   │   ├── memory.py        # Memoria contextual
│   │   └── exercise.py      # Ejercicios terapéuticos
│   ├── services/              # Lógica de negocio
│   │   ├── chat_engine.py   # Motor del chatbot
│   │   ├── groq_client.py  # Cliente API Groq
│   │   └── exercise_selector.py # Gestión de ejercicios
│   ├── prompts/               # Prompts del sistema
│   │   ├── system_prompt.py  # Personalidad del bot
│   │   └── safety_prompt.py # Respuestas de crisis
│   ├── db.py                # Configuración DB
│   └── main.py              # Entry point FastAPI
├── .env                     # Variables de entorno (protegido)
├── .env.example             # Template para desarrolladores
└── init_exercises.py        # Script inicialización

**Tecnologías Backend:**
- **FastAPI**: Framework API REST moderno
- **SQLAlchemy**: ORM para base de datos
- **SQLite**: Base de datos local (desarrollo)
- **JWT**: Autenticación sin estado
- **httpx**: Cliente HTTP asíncrono
- **python-dotenv**: Gestión de variables de entorno
- **Groq API**: LLM Llama 3.1-8b-instant

### Frontend (React) - TypeScript
📁 Estructura del Frontend:
src/
├── components/           # Componentes UI (shadcn/ui)
├── pages/              # Páginas principales
│   ├── Index.tsx    # Landing page
│   ├── Login.tsx    # Autenticación
│   ├── Chat.tsx     # Chat principal
│   └── NotFound.tsx # 404
├── hooks/              # Hooks personalizados
├── lib/               # Utilidades
└── utils/             # Funciones helper

**Tecnologías Frontend:**
- **React 18.3.1**: Framework UI con hooks
- **TypeScript**: Tipado estático
- **Vite**: Build tool ultra-rápido
- **TailwindCSS**: Framework CSS utility-first
- **shadcn/ui**: Componentes modernos
- **React Router**: Navegación SPA
- **TanStack Query**: Cache y gestión de datos
- **React Hook Form**: Formularios optimizados

---

## 🤖 **Chatbot - Estado Funcional**

### **✅ Funcionalidades Completas:**
1. **Procesamiento de Mensajes**:
   - ✅ Recepción y validación de input
   - ✅ Detección de riesgo (8 palabras clave)
   - ✅ Enrutamiento a motor de chat o crisis

2. **Motor de Chat (ChatEngine)**:
   - ✅ Contexto de usuario (nombre, objetivos, preferencias)
   - ✅ Integración con Groq API
   - ✅ Sistema de prompts estructurado

3. **Inteligencia Artificial**:
   - ✅ **Modelo**: Llama 3.1-8b-instant (Groq)
   - ✅ **Velocidad**: ~200 tokens/segundo
   - ✅ **Personalidad**: Empática, validadora
   - ✅ **Límites terapéuticos**: No diagnósticos

4. **Ejercicios Terapéuticos**:
   - ✅ **Respiración 4-7-8** (ansiedad aguda)
   - ✅ **Grounding 5-4-3-2-1** (conexión presente)
   - ✅ **Relajación Muscular Progresiva** (tensión física)
   - ✅ **Reencuadre Cognitivo** (pensamientos negativos)

5. Seguridad y Crisis:
   - Detección automática de ideación suicida
   - Respuesta predefinida de ayuda profesional
   - Derivación inmediata a recursos externos

### Funcionalidades Faltantes:
1. Selección Inteligente de Ejercicios:
   - No hay integración con `exercise_selector.py`
   - El chatbot menciona ejercicios pero no los ejecuta
   - Faltan endpoints para ejercicios individuales

2. Memoria Activa del Usuario:
   - `UserMemory` existe pero no se actualiza dinámicamente
   - No hay detección automática de estado emocional
   - No hay personalización basada en historial

3. Evaluaciones Clínicas:
   - Sin escalas estandarizadas (GAD-7, PHQ-9)
   - Sin seguimiento de progreso
   - Sin reportes para terapeutas

---

## Base de Datos - Estado Actual

### Modelos Implementados (4/4):
### **Modelos Implementados (4/4):**
```sql
-- ✅ Users (usuarios)
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE,
    alias VARCHAR,
    created_at TIMESTAMP
);

-- ✅ Messages (conversaciones)
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    is_user BOOLEAN,
    timestamp TIMESTAMP
);

-- ✅ UserMemory (contexto)
CREATE TABLE user_memories (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name_or_alias VARCHAR,
    therapeutic_goal TEXT,
    preferred_exercises TEXT, -- JSON
    last_emotional_state VARCHAR
);

-- ✅ Exercises (terapéuticos)
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY,
    name VARCHAR UNIQUE,
    description TEXT,
    instructions TEXT,
    category VARCHAR -- respiracion, grounding, relajacion, cognitivo
);
```

### **Estado de la Base de Datos:**
- ✅ **SQLite funcional** para desarrollo
- ✅ **Relaciones completas** entre modelos
- ✅ **Migraciones automáticas** al iniciar
- ❌ **Sin migraciones versionadas** (para producción)
- ❌ **Sin backups automáticos**
- ❌ **Sin conexión a PostgreSQL** (producción)

---

## 🚀 **Escalabilidad Actual**

### **✅ Puntos Fuertes:**
1. **Arquitectura Modular**: Separación clara frontend/backend
2. **API REST**: Escalable con endpoints documentados
3. **Base de Datos Relacional**: Preparada para PostgreSQL
4. **Autenticación JWT**: Sin estado, escalable
5. **Componentes Reutilizables**: shadcn/ui consistente
6. **Cache de Datos**: TanStack Query optimiza peticiones

### **❌ Limitaciones Actuales:**
1. **Base de Datos Local**: SQLite no es para producción
2. **Sin Rate Limiting**: API sin protección de abuso
3. **Sin Logging**: No hay monitoreo de errores
4. **Sin Tests**: No hay pruebas automatizadas
5. **Sin Docker**: Despliegue manual complejo
6. **Sin CI/CD**: Pipeline de despliegue manual

---

## 🔧 **Instalación y Configuración**

### **Requisitos del Sistema:**
- **Python 3.11+** (recomendado 3.14)
- **Node.js 16+** (recomendado 18+)
- **pnpm** (gestor de paquetes)
- **Cuenta Groq** (API key gratuita)

### **Instalación Backend:**
```bash
# 1. Crear entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows

# 2. Instalar dependencias
pip install fastapi uvicorn python-jose[cryptography] python-multipart sqlalchemy databases[sqlite] httpx python-dotenv

# 3. Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tu GROQ_API_KEY

# 4. Inicializar base de datos
python backend/init_exercises.py

# 5. Iniciar servidor
cd backend
python -m uvicorn app.main:app --reload
```

### **Instalación Frontend:**
```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev
```

### **URLs de Acceso:**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

---

## 📱 **Flujo de Usuario Completo**

### **1. Landing Page (/)**
- **Descripción**: Propuesta de valor y beneficios
- **Call-to-Action**: "Comenzar mi acompañamiento"
- **Diseño**: Gradientes azules, iconos de corazón

### **2. Autenticación (/login)**
- **Método**: Email simple (sin contraseña)
- **Proceso**: 
  1. Usuario ingresa email
  2. Sistema crea/verifica usuario
  3. Genera JWT token (30 min expiración)
  4. Redirección automática al chat

### **3. Chat Principal (/chat)**
- **Interfaz**: Chat tipo WhatsApp/Messenger
- **Features**:
  - **Historial completo** de conversación
  - **Botón de emergencia** "Estoy muy ansioso ahora"
  - **Indicadores de escritura** (3 puntos animados)
  - **Scroll automático** al último mensaje
  - **Logout** con limpieza de localStorage

### **4. Flujo del Chatbot**
```
Usuario envía mensaje
        ↓
   Detección de Riesgo
   (8 palabras clave)
        ↓
┌─────────────────┬─────────────────┐
│   ¿Crisis?      │   ¿Normal?      │
│   → Respuesta   │   → ChatEngine  │
│   de seguridad  │   → Groq API    │
└─────────────────┴─────────────────┘
        ↓
Validación + Ejercicio Terapéutico
        ↓
Guardado en Base de Datos
```

---

## 🛠️ **Endpoints API Completos**

### **Autenticación (/api/auth)**
- `POST /login` - Login y generación de token

### **Chat (/api/chat)**
- `POST /message` - Enviar mensaje y recibir respuesta
- `GET /history/{user_id}` - Obtener historial completo
- `PUT /memory/{user_id}` - Actualizar memoria contextual

### **Sistema (/)**
- `GET /` - Mensaje de bienvenida
- `GET /docs` - Documentación interactiva Swagger

---

## 🔒 **Seguridad Implementada**

### **✅ Medidas Actuales:**
- **JWT Tokens**: Autenticación sin estado
- **CORS Configurado**: Orígenes permitidos
- **Variables de Entorno**: `.env` en `.gitignore`
- **Validación de Input**: Pydantic models
- **Detección de Crisis**: Palabras clave predefinidas

### **🔐 Variables de Entorno:**
```env
# Database
DATABASE_URL=sqlite:///./test.db

# Security
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Groq API
GROQ_API_KEY=gsk_your_api_key_here

# Risk Detection
RISK_KEYWORDS=["suicidio", "suicidarme", "matarme", ...]
```

---

## 🚨 **Limitaciones Conocidas**

### **Técnicas:**
1. **Base de Datos**: SQLite no es production-ready
2. **Escalabilidad**: Sin horizontal scaling
3. **Monitoreo**: Sin logs estructurados
4. **Testing**: Sin suite de pruebas
5. **Performance**: Sin caché de respuestas

### **Terapéuticas:**
1. **Ejercicios**: Solo 4 básicos pre-cargados
2. **Personalización**: Sin adaptación al usuario
3. **Seguimiento**: Sin métricas de progreso
4. **Profesionales**: Sin portal para terapeutas

---

## 📈 **Roadmap de Mejoras**

### **Prioridad Alta (Próximas 2 semanas):**
1. **Integrar ExerciseSelector** con ChatEngine
2. **Implementar actualización dinámica** de UserMemory
3. **Migrar a PostgreSQL** para producción
4. **Agregar logging estructurado**

### **Prioridad Media (Próximo mes):**
1. **Implementar Rate Limiting** en API
2. **Agregar tests unitarios** y de integración
3. **Crear Docker containers**
4. **Implementar evaluaciones GAD-7**

### **Prioridad Baja (Próximos 3 meses):**
1. **Portal para terapeutas**
2. **App móvil nativa**
3. **Sistema de notificaciones**
4. **Analytics y reportes**

---

## 👥 **Desarrollado por**

**noomesk 2026 - Todos los derechos reservados**

---

## ⚖️ **Aviso Legal**

Esta aplicación es un acompañamiento entre sesiones terapéuticas, **no reemplaza la terapia profesional**. En caso de crisis grave, contacte servicios de emergencia o su terapeuta tratante.

---

## 📞 **Recursos de Crisis**

- **Línea de ayuda emocional**: [Número local]
- **Emergencias psiquiátricas**: [Número local]
- **Recursos en línea**: [Enlaces a organizaciones]

---

## 🔄 **Versión Actual**

**v0.1.0** - MVP funcional con chatbot empático y ejercicios básicos

*Última actualización: Febrero 2026*