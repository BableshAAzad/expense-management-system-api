require('dotenv').config();

const SERVER = process.env.HOST || 'localhost';
const ENV = process.env.NODE_ENV || 'development'; // Use Vite's built-in `MODE`
const HOST = ENV === 'production' ? SERVER : 'localhost';

// MSSQL Configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: HOST,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = { dbConfig }

