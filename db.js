// db.js - MySQL Connection Pool
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'db_flipbook_kka',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:  'utf8mb4'
});

module.exports = pool;
