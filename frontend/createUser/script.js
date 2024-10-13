document.getElementById('addFoto').addEventListener('click', function() {
    const fotosDiv = document.getElementById('fotos');
    const newFoto = document.createElement('div');
    newFoto.classList.add('foto');

    newFoto.innerHTML = `
        <input type="text" name="fotoId[]" placeholder="Foto ID" required>
        <input type="text" name="detail[]" placeholder="Detail" required>
    `;

    fotosDiv.appendChild(newFoto);
});

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const formData = new FormData(this);
    const fotos = [];
    
    // Crear el arreglo de fotos
    const fotoIds = formData.getAll('fotoId[]');
    const details = formData.getAll('detail[]');
    
    for (let i = 0; i < fotoIds.length; i++) {
        fotos.push({
            fotoId: fotoIds[i],
            detail: details[i]
        });
    }

    const user = {
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        telefono: formData.get('telefono'),
        fotos: fotos,
        digital: formData.get('digital'),
        total: parseFloat(formData.get('total')) // Asegúrate de que sea un número
    };

    // URL de tu API
    const apiUrl = 'http://localhost:8000/user/'; // Reemplaza con la URL real de tu API

    // Enviar los datos a la API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que estamos enviando JSON
        },
        body: JSON.stringify(user) // Convertir el objeto user a JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Manejar la respuesta de la API
        document.getElementById('response').innerText = 'Usuario agregado exitosamente: ' + JSON.stringify(data);
        // Limpiar el formulario si es necesario
        document.getElementById('userForm').reset();
    })
    .catch(error => {
        // Manejar errores
        document.getElementById('response').innerText = 'Error al agregar el usuario: ' + error.message;
    });
});
