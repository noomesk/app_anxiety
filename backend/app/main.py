from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, chat
from .db import init_db

app = FastAPI(title="Anxiety Companion API")

# CORS corregido:
# allow_credentials=True requiere orígenes explícitos (no "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",   # puerto default de vite
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
        "http://[::1]:8080",      # IPv6 localhost
        "http://[::1]:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {"message": "Anxiety Companion API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
