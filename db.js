const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Requerido para Aiven
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a MySQL en Aiven');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
})();

module.exports = pool;