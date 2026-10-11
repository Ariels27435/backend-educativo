const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());


const inicializarDatos = async () => {
  try {
    /
    await pool.query(`
      INSERT INTO estudiantes (id_estudiante, nombre)
      VALUES (1, 'Estudiante General')
      ON DUPLICATE KEY UPDATE nombre='Estudiante General';
    `);
    console.log('✅ Estudiante base (ID 1) verificado/insertado.');
  } catch (error) {
    console.error('⚠️ Error al inicializar estudiante base:', error.message);
  }
};

inicializarDatos();


app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST Educativa funcionando correctamente 🚀' });
});


app.get('/api/actividades', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM actividades');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/estudiantes', async (req, res) => {
  try {
    const { nombre, edad, nivel } = req.body;
    if (!nombre || !edad || !nivel) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (nombre, edad, nivel)' });
    }
    const [result] = await pool.query(
      'INSERT INTO estudiantes (nombre, edad, nivel) VALUES (?, ?, ?)',
      [nombre, edad, nivel]
    );
    res.status(201).json({ id_estudiante: result.insertId, nombre, edad, nivel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/progresos', async (req, res) => {
  try {
    const { id_estudiante, id_actividad, completado, puntaje, puntuacion } = req.body;
    
    
    const estudianteId = id_estudiante || 1;
    const puntos = puntaje !== undefined ? puntaje : (puntuacion !== undefined ? puntuacion : 0);

    if (!id_actividad) {
      return res.status(400).json({ error: 'Falta el id_actividad' });
    }

    const [result] = await pool.query(
      'INSERT INTO progresos (id_estudiante, id_actividad, puntuacion) VALUES (?, ?, ?)',
      [estudianteId, id_actividad, puntos]
    );

    res.status(201).json({ id_progreso: result.insertId, mensaje: 'Progreso guardado con éxito' });
  } catch (error) {
    console.error("Error en POST /api/progresos:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/progresos', async (req, res) => {
  try {
    const { id_estudiante } = req.query;
    let query = `
      SELECT p.id_progreso, p.id_estudiante, p.id_actividad, e.nombre AS estudiante, a.titulo AS actividad, 
             p.puntuacion AS puntaje, p.puntuacion, p.fecha_jugado AS fecha_completado
      FROM progresos p
      LEFT JOIN estudiantes e ON p.id_estudiante = e.id_estudiante
      LEFT JOIN actividades a ON p.id_actividad = a.id_actividad
    `;
    let params = [];

    if (id_estudiante) {
      query += ' WHERE p.id_estudiante = ?';
      params.push(id_estudiante);
    }

    query += ' ORDER BY p.id_progreso DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error en GET /api/progresos:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});