const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'malagasy_transport'
});

db.connect(err => {
    if (err) {
        console.error('❌ Erreur de connexion MySQL:', err);
    } else {
        console.log('✅ Connecté à MySQL');
    }
});

module.exports = db;