from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user
import os

app = FastAPI()

# Configurar CORS
origins = [
    "http://127.0.0.1:5500",  # Tu entorno local
    "http://localhost:5500",   # Alternativa
    "https://anderortiz.github.io",  # Reemplaza <tu-usuario> por tu usuario de GitHub
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir el router de usuarios
app.include_router(user.router)

@app.get("/", tags=["Home"])
def read_root():
    return {"Hello": "World"}

# Determina el puerto a usar
port = int(os.environ.get("PORT", 8000))  # Usar el puerto de la variable de entorno o 8000 por defecto

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
