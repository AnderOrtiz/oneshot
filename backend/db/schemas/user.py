from bson import ObjectId
from typing import Any, Dict, List


def user_schemas(user) -> dict:
    return {
        "id": str(user["_id"]),
        "nombre": user["nombre"],
        "apellido": user["apellido"],
        "telefono": user["telefono"],
        "fotos": user["fotos"],  # Asegúrate de que la estructura de fotos esté bien
        "digital": user["digital"],
        "total": user["total"]
    }

def users_schemas(users) -> list:
    return [user_schemas(user) for user in users]


def convert_objectid(data):
    if isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# db/schemas/user.py


def convert_objectid(documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Convierte una lista de documentos de MongoDB a un formato JSON serializable."""
    serialized = []
    for document in documents:
        serialized_doc = {}
        for key, value in document.items():
            if isinstance(value, ObjectId):
                serialized_doc[key] = str(value)  # Convertir ObjectId a string
            else:
                serialized_doc[key] = value
        serialized.append(serialized_doc)
    return serialized
