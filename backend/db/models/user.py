from pydantic import BaseModel
from typing import Optional, List

from pydantic import BaseModel
from typing import List

class Foto(BaseModel):
    fotoId: str
    detail: str

class User(BaseModel):
    id: Optional[str] = None
    nombre: str
    apellido: str
    telefono: int
    fotos: List[Foto]
    digital: str
    total: float



    #{
  #"id": "",
  #"nombre": "Anderson",
  #"apellido": "Ortiz",
  #"telefono": 12344566,
  #"fotos": [
  #  {"0001":"pequena 2 de cada una"}
  ##,
  #"digital": "si",
  #"total": 1
#}