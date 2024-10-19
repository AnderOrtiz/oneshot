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
        fotosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar fotos
        user.fotos.forEach(foto => {
            addPhoto(foto.fotoId, foto.detail);
        });
    })
    .catch(error => console.error('Error al cargar el usuario:', error));

// Función para agregar un nuevo conjunto de campos para fotos
function addPhoto(fotoId = '', detail = '') {
    const fotosContainer = document.querySelector('#fotosContainer');
    const fotoDiv = document.createElement('div');
    fotoDiv.classList.add('foto-item');
    fotoDiv.innerHTML = `
        <input type="text" name="fotoId" placeholder="Foto ID" value="${fotoId}">
        <input type="text" name="detail" placeholder="Detalle" value="${detail}">
        <button type="button" onclick="removePhoto(this)">Eliminar</button>
    `;
    fotosContainer.appendChild(fotoDiv);
}

// Función para eliminar una foto en el frontend
function removePhoto(button) {
    const fotoDiv = button.parentElement;
    fotoDiv.remove();
}

// Función para guardar los cambios
function saveChanges(event) {
    event.preventDefault();

    const userId = document.querySelector('#userId').value; // Obtener el ID del usuario
    const userData = {
        nombre: document.querySelector('#name').value,
        apellido: document.querySelector('#last_name').value,
        telefono: document.querySelector('#phone').value,
        digital: document.querySelector('#digital').value,
        total: document.querySelector('#total').value,
        fotos: []  // Inicializar el arreglo de fotos
    };

    // Agregar fotos desde el contenedor
    const fotosContainer = document.querySelector('#fotosContainer');
    fotosContainer.querySelectorAll('div').forEach(fotoDiv => {
        const fotoId = fotoDiv.querySelector('input[name="fotoId"]').value;
        const detalle = fotoDiv.querySelector('input[name="detail"]').value;
        userData.fotos.push({ fotoId, detail: detalle }); // Agregar cada foto al arreglo
    });

    // Hacer la petición PUT para actualizar el usuario
    fetch(`http://localhost:8000/user/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        return response.json();
    })
    .then(data => {
        alert('Usuario actualizado correctamente');
        // Redirigir a la página de la tabla de usuarios y recargar
        window.location.href = 'http://127.0.0.1:5500/frontend/ViewUser/index.html'; // Ajusta la ruta si es necesario
    })
    .catch(error => {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios: ' + error.message);
    });
}



// Asociar el evento de envío del formulario a la función saveChanges
document.querySelector('form').addEventListener('submit', saveChanges);
