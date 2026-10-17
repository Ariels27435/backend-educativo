const pool = require('../db');

const nivelPorEdad = (edad) => (edad <= 6 ? 'pre_primario' : 'primario');

const listar = async (req, res) => {
  const [filas] = await pool.query(
    'SELECT id_estudiante, nombre, edad, nivel FROM estudiantes ORDER BY nombre'
  );
  res.json(filas);
};

const registrar = async (req, res) => {
  const cuerpo = req.body ?? {};
  const nombre = String(cuerpo.nombre ?? '').trim();
  const edad = Number(cuerpo.edad);

  if (nombre.length < 2 || nombre.length > 100) {
    return res.status(400).json({ error: 'El nombre debe tener entre 2 y 100 caracteres' });
  }
  if (!Number.isInteger(edad) || edad < 3 || edad > 12) {
    return res.status(400).json({ error: 'La edad debe ser un número entero entre 3 y 12' });
  }

  const [existentes] = await pool.query(
    `SELECT id_estudiante, nombre, edad, nivel
     FROM estudiantes
     WHERE LOWER(nombre) = LOWER(?) AND edad = ?
     LIMIT 1`,
    [nombre, edad]
  );
  if (existentes.length > 0) {
    return res.status(200).json(existentes[0]);
  }

  const nivel = nivelPorEdad(edad);
  const [resultado] = await pool.query(
    'INSERT INTO estudiantes (nombre, edad, nivel) VALUES (?, ?, ?)',
    [nombre, edad, nivel]
  );
  res.status(201).json({ id_estudiante: resultado.insertId, nombre, edad, nivel });
};

module.exports = { listar, registrar };
