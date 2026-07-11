// add-admin-railway.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Forcer le chargement de .env
dotenv.config({ path: './.env' });

console.log('🔍 Ajout de l\'administrateur sur Railway...');
console.log('📡 DATABASE_URL:', process.env.DATABASE_URL ? 'DÉFINIE ✓' : 'NON DÉFINIE');

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL non définie');
    console.log('💡 Vérifiez que le fichier .env existe dans le dossier courant');
    process.exit(1);
}

// Utiliser DATABASE_URL ou construire manuellement
let connection;

if (process.env.DATABASE_URL) {
    console.log('📡 Utilisation de DATABASE_URL');
    connection = mysql.createConnection(process.env.DATABASE_URL);
} else {
    console.log('📡 Utilisation des variables individuelles');
    connection = mysql.createConnection({
        host: process.env.DB_HOST || 'mysql.railway.internal',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'railway'
    });
}

connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion:', err.message);
        process.exit(1);
    }

    console.log('✅ Connecté à Railway');

    // Hash pour 'admin123'
    const hash = '$2b$10$UNF7rtp9GRP0fR1hA5oY.1o0GGMMvLZ1.TF2SHk1/Wo8Nirs5wMS';

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
            console.log('📋 Role:', results[0].role);
            connection.end();
            process.exit(0);
        }

        // Ajouter l'admin
        const query = `
            INSERT INTO users (nom, email, mot_de_passe, role) 
            VALUES ('Administrateur', 'admin@malagasy.com', ?, 'admin')
        `;

        connection.query(query, [hash], (err, result) => {
            if (err) {
                console.error('❌ Erreur insertion:', err.message);
                connection.end();
                process.exit(1);
            }

            console.log('✅ Administrateur ajouté avec succès !');
            console.log('📝 Email: admin@malagasy.com');
            console.log('📝 Mot de passe: admin123');

            // Vérifier
            connection.query('SELECT id, nom, email, role FROM users WHERE email = "admin@malagasy.com"', (err, users) => {
                if (!err && users.length > 0) {
                    console.log('📋 Vérification:', users[0]);
                }
                connection.end();
                process.exit(0);
            });
        });
    });
});