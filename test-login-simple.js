/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-02 23:38:42
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-02 23:39:24
 * @FilePath: \MALAGASY_TRANSPORT\test-login-simple.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const crypto = require('crypto');
const mysql = require('mysql');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'malagasy_transport'
});

db.connect(err => {
    if (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }

    const email = 'admin@malagasy.com';
    const password = 'admin123';
    const hash = hashPassword(password);

    console.log('🔍 Test de connexion');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
    console.log('Hash généré:', hash);

    db.query('SELECT * FROM users WHERE email = ? AND mot_de_passe = ?', [email, hash], (err, results) => {
        if (err) console.error('Erreur:', err);
        else if (results.length === 0) {
            console.log('❌ Aucun utilisateur trouvé avec ce mot de passe');
        } else {
            console.log('✅ Connexion réussie !');
            console.log('👤 Utilisateur:', results[0]);
        }
        db.end();
        process.exit(0);
    });
});