/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-02 23:35:57
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-02 23:36:43
 * @FilePath: \MALAGASY_TRANSPORT\add-admin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const crypto = require('crypto');
const mysql = require('mysql');

// Connexion à la base
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'malagasy_transport'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion:', err);
        process.exit(1);
    }
    console.log('✅ Connecté à MySQL');
});

// Fonction pour hacher
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

const email = 'admin@malagasy.com';
const password = 'admin123';
const hashedPassword = hashPassword(password);
const nom = 'Administrateur';

console.log('📝 Création du compte admin');
console.log('Email:', email);
console.log('Mot de passe:', password);
console.log('Hash SHA256:', hashedPassword);

// Supprimer l'ancien admin
db.query('DELETE FROM users WHERE email = ?', [email], (err) => {
    if (err) console.error('Erreur suppression:', err);

    // Ajouter le nouvel admin
    db.query(
        'INSERT INTO users (nom, email, mot_de_passe, role) VALUES (?,?,?,?)',
        [nom, email, hashedPassword, 'admin'],
        (err, result) => {
            if (err) {
                console.error('❌ Erreur insertion:', err);
                process.exit(1);
            }
            console.log('✅ Admin ajouté avec succès !');
            console.log('🔑 Email:', email);
            console.log('🔑 Mot de passe:', password);

            // Vérifier
            db.query('SELECT id, nom, email, role FROM users WHERE email = ?', [email], (err, results) => {
                console.log('📋 Vérification:', results);
                db.end();
                process.exit(0);
            });
        }
    );
});