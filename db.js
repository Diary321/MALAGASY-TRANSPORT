/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-06-24 02:30:22
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-10 12:22:28
 * @FilePath: \MALAGASY_TRANSPORT\db.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// db.js - Version pour Vercel avec Railway
const mysql = require('mysql2');
require('dotenv').config();

console.log('🔍 Configuration DB:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('Port:', process.env.DB_PORT || 3306);
console.log('Database:', process.env.DB_NAME || 'railway');

// Utiliser DATABASE_URL si disponible
let dbConfig;

if (process.env.DATABASE_URL) {
    console.log('📡 Utilisation de DATABASE_URL');
    dbConfig = process.env.DATABASE_URL;
} else {
    console.log('📡 Utilisation des variables individuelles');
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
        console.error('❌ Aucune configuration DB complète trouvée. Définissez DATABASE_URL ou DB_HOST / DB_USER / DB_PASSWORD / DB_NAME.');
    }

    if (process.env.VERCEL && process.env.DB_HOST === 'mysql.railway.internal') {
        console.error('⚠️ Attention : mysql.railway.internal n\'est pas accessible depuis Vercel. Utilisez DATABASE_URL ou une instance MySQL publique/Railway accessible.');
    }

    dbConfig = {
        host: process.env.DB_HOST || 'mysql.railway.internal',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'railway',
        connectTimeout: 10000
    };
}

const db = mysql.createConnection(dbConfig);

db.connect(err => {
    if (err) {
        console.error('❌ Erreur de connexion MySQL:', err.message);
        console.log('💡 Vérifiez les identifiants Railway');
    } else {
        console.log('✅ Connecté à MySQL (Railway)');
    }
});

module.exports = db;