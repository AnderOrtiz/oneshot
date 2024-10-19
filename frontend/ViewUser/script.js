document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://oneshot-rjcw.onrender.com/user/'; // URL de tu API
    const searchInput = document.getElementById('searchInput');

    // Función para obtener datos de la API
    function fetchUsers() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                renderUsers(data); // Renderiza los usuarios inicialmente

                // Asignar evento de búsqueda
                searchInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    const filteredUsers = data.filter(user => {
                        const userPhotos = user.fotos ? user.fotos.map(foto => foto.fotoId).join(', ') : '';
                        return (
                            String(user.nombre).toLowerCase().includes(searchTerm) ||
                            String(user.apellido).toLowerCase().includes(searchTerm) ||
                            String(user.telefono).toLowerCase().includes(searchTerm) || // Convertimos a string
                            userPhotos.toLowerCase().includes(searchTerm)
                        );
                    });
                    renderUsers(filteredUsers); // Renderiza los usuarios filtrados
                });
            })
            .catch(error => console.error('Error al obtener usuarios:', error));
    }

    // Función para renderizar usuarios en la tabla
    function renderUsers(users) {
        const tableBody = document.querySelector('#userTable tbody');
        tableBody.innerHTML = ''; // Limpiar el contenido previo

        // Verifica si users es un array
        if (Array.isArray(users)) {
            users.forEach(user => {
                const row = document.createElement('tr');
                
                // Si el usuario tiene fotos, generar las columnas de IDs y detalles
                const fotoIds = user.fotos && Array.isArray(user.fotos) 
                    ? user.fotos.map(foto => foto.fotoId).join('<br>') 
                    : 'Sin fotos';
                
                const fotoDetails = user.fotos && Array.isArray(user.fotos) 
                    ? user.fotos.map(foto => foto.detail).join('<br>') 
                    : 'Sin detalles';

                row.innerHTML = `
                    <td>${String(user.nombre)}</td>
                    <td>${String(user.apellido)}</td>
                    <td>${String(user.telefono)}</td>
                    <td>${fotoIds}</td> <!-- Columna de IDs de las fotos -->
                    <td>${fotoDetails}</td> <!-- Columna de detalles de las fotos -->
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
            console.warn('La respuesta no es un array:', users);
        }

        // Agregar eventos a los botones
        addEventListeners();
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
