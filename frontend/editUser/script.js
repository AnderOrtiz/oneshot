// Obtener el ID del usuario de la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
console.log("ID del usuario desde la URL:", userId);

// Comprobar si el ID está presente
if (!userId) {
    console.error("ID no proporcionado en la URL");
    alert("ID del usuario no encontrado");
    window.location.href = 'http://127.0.0.1:5500/frontend/ViewUser/index.html'; // Redirigir si no hay ID
}

// Obtener el usuario al cargar la página
fetch(`http://localhost:8000/user/${userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener el usuario');
        }
        return response.json();
    })
    .then(user => {
        console.log("Usuario obtenido:", user);
        // Cargar los datos en el formulario
        document.querySelector('#userId').value = user.id; // Almacena el ID del usuario
        document.querySelector('#name').value = user.nombre;
        document.querySelector('#last_name').value = user.apellido;
        document.querySelector('#phone').value = user.telefono;
        document.querySelector('#digital').value = user.digital;
        document.querySelector('#total').value = user.total;

        // Cargar fotos si es necesario
        const fotosContainer = document.querySelector('#fotosContainer');
        user.fotos.forEach(foto => {
            const fotoDiv = document.createElement('div');
            fotoDiv.innerHTML = `<input type="text" name="fotoId" placeholder="Foto ID" value="${foto.fotoId}">
                                 <input type="text" name="detail" placeholder="Detalle" value="${foto.detail}">`;
            fotosContainer.appendChild(fotoDiv);
        });
    })
    .catch(error => console.error('Error al cargar el usuario:', error));

// Función para guardar los cambios
function saveChanges(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    const updatedUser = {
        id: userId,
        nombre: document.querySelector('#name').value,
        apellido: document.querySelector('#last_name').value,
        telefono: parseInt(document.querySelector('#phone').value),
        fotos: Array.from(document.querySelectorAll('#fotosContainer div')).map(div => ({
            fotoId: div.querySelector('input[name="fotoId"]').value,
            detail: div.querySelector('input[name="detail"]').value
        })),
        digital: document.querySelector('#digital').value,
        total: parseFloat(document.querySelector('#total').value)
    };

    console.log('Datos a enviar:', updatedUser); // Log de los datos que se enviarán

    fetch(`http://localhost:8000/user/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario actualizado:', data);
        // Redirigir a la tabla de ver usuarios
        window.location.href = 'http://127.0.0.1:5500/frontend/ViewUser/index.html';
    })
    .catch(error => console.error('Error al actualizar el usuario:', error));
}

// Asociar el evento de envío del formulario a la función saveChanges
document.querySelector('form').addEventListener('submit', saveChanges);
