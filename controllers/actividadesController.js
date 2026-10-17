const pool = require('../db');

const listar = async (req, res) => {
  const [filas] = await pool.query(
    `SELECT id_actividad, titulo, categoria, nivel
     FROM actividades
     ORDER BY FIELD(nivel, 'pre_primario', 'primario'), id_actividad`
  );
  res.json(filas);
};

module.exports = { listar };
