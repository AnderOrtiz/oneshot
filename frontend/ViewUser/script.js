document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:8000/user/'; // URL de tu API

    // Función para obtener datos de la API
    function fetchUsers() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#userTable tbody');
                tableBody.innerHTML = ''; // Limpiar el contenido previo

                // Verifica si data es un array
                if (Array.isArray(data)) {
                    data.forEach(user => {
                        // Comprueba si el usuario tiene fotos
                        if (user.fotos && Array.isArray(user.fotos)) {
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
                                        <button class="edit-btn" data-id="${user.id}">Editar</button>
                                        <button class="delete-btn" data-id="${user.id}">Eliminar</button>
                                    </td>
                                `;
                                tableBody.appendChild(row);
                            });
                        } else {
                            console.warn('El usuario no tiene fotos:', user);
                        }
                    });
                } else {
                    console.warn('La respuesta no es un array:', data);
                }

                // Agregar eventos a los botones
                addEventListeners();
            })
            .catch(error => console.error('Error al obtener usuarios:', error));
    }

    // Función para agregar eventos a los botones
    function addEventListeners() {
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                if (userId) {
                    // Redirigir a la página de edición
                    window.location.href = `../editUser/edit-user.html?id=${userId}`;
                } else {
                    console.error('ID de usuario no encontrado');
                }
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                if (userId) {
                    if (confirm(`¿Estás seguro de que quieres eliminar el usuario con ID: ${userId}?`)) {
                        deleteUser(userId);
                    }
                } else {
                    console.error('ID de usuario no encontrado');
                }
            });
        });
    }

    // Función para eliminar un usuario
    function deleteUser(userId) {
        fetch(`${apiUrl}${userId}`, {
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
        .catch(error => console.error('Error al eliminar el usuario:', error));
    }

    // Llamar a la función para cargar los usuarios al cargar la página
    fetchUsers();
});
