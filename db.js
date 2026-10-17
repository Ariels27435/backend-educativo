const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const conexion = await pool.getConnection();
    console.log('Conexion exitosa a MySQL');
    conexion.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
})();

module.exports = pool;
