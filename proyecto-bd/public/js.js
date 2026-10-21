document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const mensaje = document.getElementById('mensaje');
    const btnCargar = document.getElementById('btn-cargar');
    const tablaCuerpo = document.getElementById('tabla-cuerpo');

    // 1. Función para enviar el formulario y registrar un alumno
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue sola

        const datosAlumno = {
            nombre: document.getElementById('nombre').value,
            dni: document.getElementById('dni').value,
            curso: document.getElementById('curso').value,
            especialidad: document.getElementById('especialidad').value,
            turno: document.getElementById('turno').value
        };

        try {
            const respuesta = await fetch('/api/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosAlumno)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                mensaje.textContent = "Alumno registrado correctamente.";
                mensaje.style.color = "green";
                formulario.reset(); // Limpia el formulario
                cargarAlumnos(); // Actualiza la tabla automáticamente al guardar
            } else {
                mensaje.textContent = "Error al guardar: " + (resultado.error || "Desconocido");
                mensaje.style.color = "red";
            }
        } catch (error) {
            console.error("Error de red:", error);
            mensaje.textContent = "Hubo un problema al conectar con el servidor.";
            mensaje.style.color = "red";
        }
    });

    // 2. Función para ir a buscar los datos al servidor y mostrarlos en la tabla
    async function cargarAlumnos() {
        try {
            const respuesta = await fetch('/api/alumnos');
            const alumnos = await respuesta.json();

            // Limpiamos la tabla antes de dibujar
            tablaCuerpo.innerHTML = '';

            // Recorremos cada alumno y creamos una fila <tr>
            alumnos.forEach(alumno => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${alumno.nombre}</td>
                    <td>${alumno.dni}</td>
                    <td>${alumno.curso}</td>
                    <td>${alumno.especialidad}</td>
                    <td>${alumno.turno}</td>
                `;
                tablaCuerpo.appendChild(fila);
            });
        } catch (error) {
            console.error("Error al cargar la lista:", error);
        }
    }

    // Cargar la lista automáticamente al abrir la página
    cargarAlumnos();

    // Por si también quieres usar el botón para actualizar manualmente
    if (btnCargar) {
        btnCargar.addEventListener('click', cargarAlumnos);
    }
});