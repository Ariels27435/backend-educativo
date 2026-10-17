const pool = require('../db');

const esEnteroPositivo = (valor) => Number.isInteger(valor) && valor > 0;

const listar = async (req, res) => {
  let consulta = `
    SELECT p.id_progreso, p.id_estudiante, p.id_actividad,
           e.nombre AS estudiante, e.edad, a.titulo AS actividad,
           p.puntuacion, p.fecha_jugado
    FROM progresos p
    INNER JOIN estudiantes e ON e.id_estudiante = p.id_estudiante
    INNER JOIN actividades a ON a.id_actividad = p.id_actividad
  `;
  const parametros = [];

  const filtro = req.query.id_estudiante;
  if (filtro !== undefined && filtro !== '') {
    const idEstudiante = Number(filtro);
    if (!esEnteroPositivo(idEstudiante)) {
      return res.status(400).json({ error: 'El identificador del estudiante no es válido' });
    }
    consulta += ' WHERE p.id_estudiante = ?';
    parametros.push(idEstudiante);
  }

  consulta += ' ORDER BY p.id_progreso DESC';

  const [filas] = await pool.query(consulta, parametros);
  res.json(filas);
};

const registrar = async (req, res) => {
  const cuerpo = req.body ?? {};
  const idEstudiante = Number(cuerpo.id_estudiante);
  const idActividad = Number(cuerpo.id_actividad);
  const puntuacion = Number(cuerpo.puntuacion);

  if (!esEnteroPositivo(idEstudiante)) {
    return res.status(400).json({ error: 'El estudiante no es válido' });
  }
  if (!esEnteroPositivo(idActividad)) {
    return res.status(400).json({ error: 'La actividad no es válida' });
  }
  if (!Number.isInteger(puntuacion) || puntuacion < 0 || puntuacion > 100) {
    return res.status(400).json({ error: 'La puntuación debe ser un entero entre 0 y 100' });
  }

  const [estudiantes] = await pool.query(
    'SELECT 1 FROM estudiantes WHERE id_estudiante = ?',
    [idEstudiante]
  );
  if (estudiantes.length === 0) {
    return res.status(404).json({ error: 'El estudiante no existe' });
  }

  const [actividades] = await pool.query(
    'SELECT 1 FROM actividades WHERE id_actividad = ?',
    [idActividad]
  );
  if (actividades.length === 0) {
    return res.status(404).json({ error: 'La actividad no existe' });
  }

  const [resultado] = await pool.query(
    'INSERT INTO progresos (id_estudiante, id_actividad, puntuacion) VALUES (?, ?, ?)',
    [idEstudiante, idActividad, puntuacion]
  );
  res.status(201).json({ id_progreso: resultado.insertId, mensaje: 'Progreso guardado' });
};

module.exports = { listar, registrar };
