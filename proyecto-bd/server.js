const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración para recibir JSON y datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta "public" donde está tu index.html y js.js
app.use(express.static(path.join(__dirname, 'public')));

// 1. Conectar (o crear) la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Error al conectar con la BD:", err.message);
    } else {
        console.log("Conectado con éxito a la base de datos SQLite.");
    }
});

// 2. Crear la tabla 'alumnos' si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS alumnos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        dni TEXT NOT NULL,
        curso TEXT NOT NULL,
        especialidad TEXT NOT NULL,
        turno TEXT NOT NULL
    )
`);

// 3. Ruta POST para recibir los datos del formulario y guardarlos
app.post('/api/agregar', (req, res) => {
    const { nombre, dni, curso, especialidad, turno } = req.body;

    const sql = `INSERT INTO alumnos (nombre, dni, curso, especialidad, turno) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [nombre, dni, curso, especialidad, turno], function(err) {
        if (err) {
            console.error("Error al insertar:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: "Alumno registrado con éxito", id: this.lastID });
    });
});

// Ruta GET para obtener todos los alumnos guardados
app.get('/api/alumnos', (req, res) => {
    console.log("¡Se solicitó la ruta /api/alumnos desde el navegador!"); // <--- Agrega esto
    
    const sql = `SELECT * FROM alumnos`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error al consultar:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 5. Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});