document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:8000/user/'; // Reemplaza con la URL real de tu API
    const userId = new URLSearchParams(window.location.search).get('id'); // Obtiene el ID del usuario de la URL

    // Función para obtener datos del usuario
    function fetchUser() {
        fetch(`${apiUrl}${userId}`)
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener el usuario');
                return response.json();
            })
            .then(user => {
                document.getElementById('userId').value = user.id;
                document.getElementById('nombre').value = user.name;
                document.getElementById('apellido').value = user.last_name;
                document.getElementById('telefono').value = user.phone;
                document.getElementById('digital').value = user.digital;
                document.getElementById('total').value = user.total;

                // Agregar las fotos
                user.fotos.forEach(foto => {
                    addFoto(foto.fotoId, foto.detail);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Función para agregar un nuevo campo de foto
    function addFoto(fotoId = '', detail = '') {
        const fotosDiv = document.getElementById('fotos');
        const newFoto = document.createElement('div');
        newFoto.classList.add('foto');

        newFoto.innerHTML = `
            <input type="text" name="fotoId[]" placeholder="Foto ID" required value="${fotoId}">
            <input type="text" name="detail[]" placeholder="Detalle" required value="${detail}">
        `;

        fotosDiv.appendChild(newFoto);
    }

    document.getElementById('addFoto').addEventListener('click', function() {
        addFoto();
    });

    document.getElementById('editUserForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const userData = {
            id: userId,
            name: document.getElementById('nombre').value,
            last_name: document.getElementById('apellido').value,
            phone: document.getElementById('telefono').value,
            digital: document.getElementById('digital').value,
            total: parseFloat(document.getElementById('total').value),
            fotos: Array.from(document.querySelectorAll('#fotos .foto')).map(foto => ({
                fotoId: foto.querySelector('input[name="fotoId[]"]').value,
                detail: foto.querySelector('input[name="detail[]"]').value,
            }))
        };

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al actualizar el usuario');
            return response.json();
        })
        .then(data => {
            document.getElementById('response').innerText = 'Usuario actualizado con éxito';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('response').innerText = 'Error al actualizar el usuario';
        });
    });

    fetchUser(); // Cargar los datos del usuario al iniciar
});
