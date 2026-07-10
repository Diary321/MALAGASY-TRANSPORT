/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-10 02:30:28
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-10 02:30:56
 * @FilePath: \MALAGASY_TRANSPORT\add-admin-railway.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// add-admin-railway.js
const mysql = require('mysql2');
require('dotenv').config();

console.log('🔍 Ajout de l\'administrateur sur Railway...');

if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    console.error('❌ Aucune configuration de base de données trouvée');
    process.exit(1);
}

let connection;

if (process.env.DATABASE_URL) {
    connection = mysql.createConnection(process.env.DATABASE_URL);
} else {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
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

    const query = `
        INSERT INTO users (nom, email, mot_de_passe, role) 
        VALUES ('Administrateur', 'admin@malagasy.com', ?, 'admin')
    `;

    connection.query(query, [hash], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log('⚠️ L\'administrateur existe déjà !');
            } else {
                console.error('❌ Erreur:', err.message);
            }
            connection.end();
            process.exit(1);
        }

        console.log('✅ Administrateur ajouté avec succès !');
        console.log('📝 Email: admin@malagasy.com');
        console.log('📝 Mot de passe: admin123');

        // Vérifier
        connection.query('SELECT id, nom, email, role FROM users WHERE email = ?', ['admin@malagasy.com'], (err, users) => {
            if (!err && users.length > 0) {
                console.log('📋 Vérification:', users[0]);
            }
            connection.end();
            process.exit(0);
        });
    });
});