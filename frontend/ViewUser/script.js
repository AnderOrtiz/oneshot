document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:8000/user/'; // Reemplaza con la URL real de tu API

    // Función para obtener datos de la API
    function fetchUsers() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#userTable tbody');
                tableBody.innerHTML = ''; // Limpiar el contenido previo

                data.forEach(user => {
                    user.fotos.forEach(foto => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${user.nombre}</td>
                            <td>${user.apellido}</td>
                            <td>${user.telefono}</td>
                            <td>${foto.fotoId}</td>
                            <td>${foto.detail}</td>
                            <td>${user.digital}</td>
                            <td>${user.total}</td>
                            <td>
                                <button class="edit-btn" data-id="${user._id}">Editar</button>
                                <button class="delete-btn" data-id="${user._id}">Eliminar</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                });

                // Agregar eventos a los botones
                addEventListeners();
            })
            .catch(error => console.error('Error:', error));
    }

    // Función para agregar eventos a los botones
    function addEventListeners() {
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.dataset.id;
                // Lógica para editar el usuario
                alert(`Editar usuario con ID: ${userId}`);
                // Aquí puedes redirigir a un formulario de edición o abrir un modal
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.dataset.id;
                // Lógica para eliminar el usuario
                if (confirm(`¿Estás seguro de que quieres eliminar el usuario con ID: ${userId}?`)) {
                    deleteUser(userId);
                }
            });
        });
    }

    // Función para eliminar un usuario
    function deleteUser(userId) {
        fetch(`${apiUrl}${userId}`, { // Asegúrate de que tu API acepte DELETE en esta ruta
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Usuario eliminado correctamente.');
                fetchUsers(); // Volver a cargar la lista de usuarios
            } else {
                alert('Error al eliminar el usuario.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Llamar a la función para cargar los usuarios al cargar la página
    fetchUsers();
});
