/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-10 02:41:09
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-10 02:42:40
 * @FilePath: \MALAGASY_TRANSPORT\init-railway.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// init-railway.js
const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

console.log('🔍 Importation du schéma sur Railway...');
console.log('=====================================');

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL non définie dans .env');
    process.exit(1);
}

console.log('📡 Connexion à Railway...');

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion:', err.message);
        process.exit(1);
    }

    console.log('✅ Connecté à Railway');

    // Lire le fichier schema.sql
    try {
        const sql = fs.readFileSync('schema.sql', 'utf8');

        // Séparer les requêtes (split sur ;)
        const queries = sql.split(';').filter(q => q.trim());

        console.log(`📝 Exécution de ${queries.length} requêtes...`);

        let executed = 0;
        let errors = 0;

        queries.forEach((query, index) => {
            connection.query(query, (err, result) => {
                executed++;
                if (err) {
                    errors++;
                    console.log(`❌ Erreur requête ${index + 1}:`, err.message.substring(0, 100));
                } else {
                    console.log(`✅ Requête ${index + 1} exécutée`);
                }

                // Vérifier si c'est la dernière requête
                if (executed === queries.length) {
                    console.log('\n=====================================');
                    if (errors === 0) {
                        console.log('✅ Importation terminée avec succès !');
                    } else {
                        console.log(`⚠️ ${errors} erreur(s) rencontrée(s)`);
                    }

                    // Vérifier les tables
                    connection.query('SHOW TABLES', (err, tables) => {
                        if (err) {
                            console.error('❌ Erreur listing tables:', err.message);
                        } else {
                            console.log(`\n📋 ${tables.length} table(s) trouvée(s):`);
                            tables.forEach(table => {
                                console.log('   -', Object.values(table)[0]);
                            });
                        }

                        // Vérifier l'admin
                        connection.query('SELECT id, nom, email, role FROM users WHERE role = "admin"', (err, admins) => {
                            if (!err && admins.length > 0) {
                                console.log('\n🔑 Administrateur:');
                                console.log('   Email:', admins[0].email);
                                console.log('   Mot de passe: admin123');
                            }

                            connection.end();
                            console.log('\n✅ Terminé !');
                            process.exit(0);
                        });
                    });
                }
            });
        });

    } catch (error) {
        console.error('❌ Erreur lecture fichier:', error.message);
        connection.end();
        process.exit(1);
    }
});