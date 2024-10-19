import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user

app = FastAPI()

# Configurar CORS
origins = [
    "http://127.0.0.1:5500",  # Tu entorno local
    "http://localhost:5500",   # Alternativa
    "https://AnderOrtiz.github.io"  # Reemplaza <tu-usuario> por tu usuario de GitHub
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluye el router de usuarios
app.include_router(user.router)

@app.get("/", tags=["Home"])
def read_root():
    return {"Hello": "World"}

# Obtener el puerto desde la variable de entorno
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render especifica el puerto en esta variable
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
