const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import des routes
const authRoutes = require('./auth');
const clientRoutes = require('./client');
const adminRoutes = require('./admin');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Routes API
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/admin', adminRoutes);

// Route par défaut - Servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
    console.error('❌ Erreur:', err);
    res.status(500).send('Erreur interne du serveur');
});

// Export pour Vercel
module.exports = app;

// Lancement en local (uniquement si fichier exécuté directement)
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`✅ Serveur MALAGASY TRANSPORT sur http://localhost:${port}`);
        console.log(`📱 Ouvrez http://localhost:${port}`);
        console.log(`🔗 Base de données: ${process.env.DB_HOST || 'Railway'}`);
    });
}