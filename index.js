const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db');

const actividadesRoutes = require('./routes/actividadesRoutes');
const estudiantesRoutes = require('./routes/estudiantesRoutes');
const progresosRoutes = require('./routes/progresosRoutes');

const app = express();

const origenes = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origen) => origen.trim())
  : '*';

app.use(cors({ origin: origenes, methods: ['GET', 'POST'] }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST educativa en funcionamiento' });
});

app.use('/api/actividades', actividadesRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/progresos', progresosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  const estado = err.status && err.status < 500 ? err.status : 500;
  if (estado === 500) console.error(err);
  res.status(estado).json({
    error: estado === 500 ? 'Error interno del servidor' : 'Solicitud no válida'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
