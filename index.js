const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();


app.use(cors());
app.use(express.json());

// Ruta de prueba
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
    const { id_estudiante, id_actividad, puntuacion } = req.body;
    if (!id_estudiante || !id_actividad || puntuacion === undefined) {
      return res.status(400).json({ error: 'Faltan datos requeridos para el progreso' });
    }
    const [result] = await pool.query(
      'INSERT INTO progresos (id_estudiante, id_actividad, puntuacion) VALUES (?, ?, ?)',
      [id_estudiante, id_actividad, puntuacion]
    );
    res.status(201).json({ id_progreso: result.insertId, mensaje: 'Progreso guardado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/progresos', async (req, res) => {
  try {
    const { id_estudiante } = req.query;
    let query = `
      SELECT p.id_progreso, e.nombre AS estudiante, a.titulo AS actividad, 
             p.puntuacion, p.fecha_jugado
      FROM progresos p
      JOIN estudiantes e ON p.id_estudiante = e.id_estudiante
      JOIN actividades a ON p.id_actividad = a.id_actividad
    `;
    let params = [];

    if (id_estudiante) {
      query += ' WHERE p.id_estudiante = ?';
      params.push(id_estudiante);
    }

    query += ' ORDER BY p.fecha_jugado DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});