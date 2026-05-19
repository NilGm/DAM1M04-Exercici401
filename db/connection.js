const mysql = require('mysql2/promise');

// Configura els paràmetres de connexió amb la teva base de dades de MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Canvia-ho si el teu usuari no és root
    password: 'Calamot2023',          // Posa aquí la teva contrasenya de MySQL
    database: 'minierp',   // Canvia-ho pel nom exacte de la teva base de dades
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;