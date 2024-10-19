from fastapi import APIRouter, HTTPException, status
from db.models.user import User
from db.schemas.user import user_schemas, users_schemas, convert_objectid
from db.client import db_client
from bson import ObjectId

router = APIRouter(
    prefix="/user",
    tags=["User"],
    responses={status.HTTP_404_NOT_FOUND: {"message": "No encontrado"}}
)

# Obtener todos los usuarios
@router.get("/", response_model=list[User])
async def all_user():
    users = list(db_client.users.find())  # Obtén la lista de usuarios
    return convert_objectid(users)


@router.get("/{id}", response_model=User, status_code=status.HTTP_200_OK)
async def get_user(id: str):
    try:
        user = db_client.users.find_one({"_id": ObjectId(id)})
        if user is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return convert_objectid(user)  # Asegúrate de llamar a la función aquí
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Crear un nuevo usuario
@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
    user_dict = dict(user)

    # Verificar si la clave 'id' está en el diccionario antes de intentar eliminarla
    if "id" in user_dict:
        del user_dict["id"]

    user_dict['fotos'] = [dict(foto) for foto in user.fotos]

    try:
        inserted_id = db_client.users.insert_one(user_dict).inserted_id
        user_dict['id'] = str(inserted_id)  # Añadir el ID insertado
        return user_dict  # Retornar el diccionario del usuario, incluyendo el ID
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creando usuario: {str(e)}")



@router.put("/{id}", response_model=User)
async def update_user(id: str, user: User):
    user_dict = dict(user)

    # Asegúrate de que estás eliminando el campo 'id'
    if "id" in user_dict:
        del user_dict["id"]

    # Convertir 'fotos' a diccionario si es necesario
    if 'fotos' in user_dict:
        user_dict['fotos'] = [dict(foto) for foto in user.fotos]

    try:
        update_result = db_client.users.update_one(
            {"_id": ObjectId(id)},  # Asegúrate de que el ID es correcto
            {"$set": user_dict}
        )
        if update_result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
    except Exception as e:
        print(f"Error actualizando usuario con ID {id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error actualizando usuario: {str(e)}")

    updated_user = db_client.users.find_one({"_id": ObjectId(id)})
    if updated_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado después de la actualización")

    return convert_objectid(updated_user)

def convert_objectid(users):
    if isinstance(users, list):
        return [{**user, "id": str(user["_id"])} for user in users]
    else:
        return {**users, "id": str(users["_id"])}  # Para un solo usuario


# Eliminar un usuario
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(id: str):
    found = db_client.users.find_one_and_delete({"_id": ObjectId(id)})
    if not found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")