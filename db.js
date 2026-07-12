// db.js - Version corrigée pour Vercel
const mysql = require('mysql2');
require('dotenv').config();

console.log('🔍 Configuration DB pour Vercel:');

// Détecter si on est sur Vercel
const isVercel = process.env.VERCEL === '1';

// Utiliser l'URL publique pour Vercel
let dbConfig;

if (process.env.DATABASE_URL) {
    console.log('📡 Utilisation de DATABASE_URL');
    dbConfig = process.env.DATABASE_URL;
} else {
    console.log('📡 Utilisation des variables individuelles');

    // Sur Vercel, utiliser l'URL publique
    const host = isVercel
        ? (process.env.DB_PUBLIC_HOST || 'switchyard.proxy.rlwy.net')
        : (process.env.DB_HOST || 'localhost');

    const port = isVercel
        ? (process.env.DB_PUBLIC_PORT || 29442)
        : (process.env.DB_PORT || 3306);

    console.log(`📡 Host: ${host}, Port: ${port}`);

    dbConfig = {
        host: host,
        port: parseInt(port),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'FtpPySNnXcFeoMqOtgmCUgHizLycFhIp',
        database: process.env.DB_NAME || 'railway',
        connectTimeout: 30000,
        ssl: isVercel ? { rejectUnauthorized: false } : undefined
    };
}

const db = mysql.createConnection(dbConfig);

db.connect(err => {
    if (err) {
        console.error('❌ Erreur de connexion MySQL:', err.message);
        console.log('💡 Host utilisé:', dbConfig.host || dbConfig);
        console.log('💡 Port utilisé:', dbConfig.port || 3306);
    } else {
        console.log('✅ Connecté à MySQL (Railway)');
    }
});

module.exports = db;