from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
origins = [
    "http://127.0.0.1:5500",  # Tu frontend
    "http://localhost:5500",   # Alternativa
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# El resto de tu código


app.include_router(user.router)


@app.get("/", tags=["Home"])
def read_root():
    return {"Hello": "World"}




#https://fastapi.tiangolo.com/

#https://pymongo.readthedocs.io/en/stable/examples/index.html

#https://github.com/AnderOrtiz/e-comerse