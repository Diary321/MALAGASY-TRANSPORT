// init-db.js
const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

console.log('🔍 Importation du schéma sur Railway...');
console.log('=====================================');

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

    // Lire le fichier schema.sql
    try {
        const sql = fs.readFileSync('schema.sql', 'utf8');

        // Exécuter le script
        connection.query(sql, (err) => {
            if (err) {
                console.error('❌ Erreur lors de l\'importation:', err.message);
                console.log('💡 Essayez d\'importer manuellement via la console Railway');
                connection.end();
                process.exit(1);
            }

            console.log('✅ Schéma importé avec succès !');

            // Vérifier les tables
            connection.query('SHOW TABLES', (err, tables) => {
                if (err) {
                    console.error('❌ Erreur:', err.message);
                } else {
                    console.log(`\n📋 ${tables.length} table(s) créées:`);
                    tables.forEach(table => {
                        console.log('   -', Object.values(table)[0]);
                    });
                }

                connection.end();
                console.log('\n✅ Importation terminée !');
                process.exit(0);
            });
        });
    } catch (error) {
        console.error('❌ Erreur lecture schema.sql:', error.message);
        connection.end();
        process.exit(1);
    }
});