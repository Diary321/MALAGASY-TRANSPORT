// test-railway.js - Version sans secrets
const mysql = require('mysql2');
require('dotenv').config();

console.log('🔍 Test de connexion à Railway MySQL...');
console.log('=====================================');

// Vérifier que les variables sont définies
if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    console.error('❌ Aucune configuration de base de données trouvée');
    console.log('💡 Vérifiez votre fichier .env');
    process.exit(1);
}

// Afficher la configuration (masquer le mot de passe)
console.log('📋 Configuration:');
console.log('DB_HOST:', process.env.DB_HOST || 'NON DÉFINI');
console.log('DB_PORT:', process.env.DB_PORT || 'NON DÉFINI');
console.log('DB_USER:', process.env.DB_USER || 'NON DÉFINI');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'DÉFINI ✓' : 'NON DÉFINI');
console.log('DB_NAME:', process.env.DB_NAME || 'NON DÉFINI');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'DÉFINI ✓' : 'NON DÉFINI');
console.log('=====================================');

// Créer la connexion
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
        database: process.env.DB_NAME || 'railway',
        connectTimeout: 10000
    });
}

// Tester la connexion
connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion:', err.message);
        console.log('\n💡 Vérifiez :');
        console.log('   - Les valeurs dans .env');
        console.log('   - La base Railway est active (état "Running")');
        console.log('   - Vous avez une connexion Internet');
        process.exit(1);
    }

    console.log('✅ Connexion réussie à Railway !');

    // Tester une requête simple
    connection.query('SELECT 1+1 AS result, NOW() AS current_time, DATABASE() AS db_name', (err, results) => {
        if (err) {
            console.error('❌ Erreur requête:', err.message);
            connection.end();
            process.exit(1);
        }

        console.log('✅ Requête test réussie !');
        console.log('📊 Base de données:', results[0].db_name);
        console.log('🕐 Heure du serveur:', results[0].current_time);

        // Lister les tables
        connection.query('SHOW TABLES', (err, tables) => {
            if (err) {
                console.error('❌ Erreur listing tables:', err.message);
            } else if (tables.length === 0) {
                console.log('⚠️ Aucune table trouvée.');
                console.log('📝 Exécutez: node init-railway.js');
            } else {
                console.log(`\n📋 ${tables.length} table(s) trouvée(s):`);
                tables.forEach(table => {
                    console.log('   -', Object.values(table)[0]);
                });

                // Vérifier l'admin
                connection.query('SELECT email, role FROM users WHERE role = "admin" LIMIT 1', (err, admins) => {
                    if (!err && admins.length > 0) {
                        console.log('\n🔑 Administrateur trouvé:');
                        console.log('   Email:', admins[0].email);
                        console.log('   Mot de passe: admin123');
                    } else {
                        console.log('\n⚠️ Aucun administrateur trouvé.');
                        console.log('📝 Exécutez: node add-admin-railway.js');
                    }

                    connection.end();
                    console.log('\n✅ Test terminé avec succès !');
                    process.exit(0);
                });
            }
        });
    });
});