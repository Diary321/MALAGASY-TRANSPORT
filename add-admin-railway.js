// add-admin-direct.js
const mysql = require('mysql2');
const crypto = require('crypto');

console.log('🔍 Ajout de l\'administrateur sur Railway...');

// Configuration directe (remplacez par vos valeurs)
const config = {
    host: 'switchyard.proxy.rlwy.net',
    port: 29442,
    user: 'root',
    password: 'FtpPySNnXcFeoMqOtgmCUgHizLycFhIp',
    database: 'railway'
};

console.log('📡 Connexion à:', config.host);

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion:', err.message);
        process.exit(1);
    }

    console.log('✅ Connecté à Railway');

    // Hash SHA256 pour 'admin123'
    const hash = crypto.createHash('sha256').update('admin123').digest('hex');

    // Vérifier si l'admin existe déjà
    connection.query('SELECT * FROM users WHERE email = "admin@malagasy.com"', (err, results) => {
        if (err) {
            console.error('❌ Erreur:', err.message);
            connection.end();
            process.exit(1);
        }

        if (results.length > 0) {
            console.log('⚠️ L\'administrateur existe déjà !');
            console.log('📋 Email:', results[0].email);
            connection.end();
            process.exit(0);
        }

        // Ajouter l'admin
        connection.query(
            'INSERT INTO users (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
            ['Administrateur', 'admin@malagasy.com', hash, 'admin'],
            (err, result) => {
                if (err) {
                    console.error('❌ Erreur insertion:', err.message);
                    connection.end();
                    process.exit(1);
                }

                console.log('✅ Administrateur ajouté avec succès !');
                console.log('📝 Email: admin@malagasy.com');
                console.log('📝 Mot de passe: admin123');
                connection.end();
                process.exit(0);
            }
        );
    });
});