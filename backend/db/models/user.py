from pydantic import BaseModel
from typing import Optional, List

class User(BaseModel):
    id: Optional[str] = None
    nombre: str
    apellido: str
    telefono: str
    fotos: dict
    digital: str
    total: str