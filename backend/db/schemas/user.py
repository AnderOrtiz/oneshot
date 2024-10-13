from bson import ObjectId

def user_schemas(user) -> dict:
    return {
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