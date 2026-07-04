const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // mets ton mot de passe MySQL
    database: 'malagasy_transport'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Connecté à MySQL');
});

module.exports = db;
