import os
from fastapi import FastAPI
from routers import user

app = FastAPI()


# Incluye el router de usuarios
app.include_router(user.router)

@app.get("/", tags=["Home"])
def read_root():
    return {"Hello": "World"}