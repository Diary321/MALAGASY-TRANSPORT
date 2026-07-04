/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-06-24 02:29:08
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-01 22:51:06
 * @FilePath: \MALAGASY_TRANSPORT\serveur.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Utilise le port 3000 par défaut

// Import des routes
const authRoutes = require('./auth');
const clientRoutes = require('./client');
const adminRoutes = require('./admin');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// ✅ Servir index.html à la racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes API
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/admin', adminRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
    console.log(`✅ Serveur MALAGASY TRANSPORT sur http://localhost:${port}`);
    console.log(`📱 Ouvrez http://localhost:${port}`);
    console.log(`🔐 Admin: http://localhost:${port}/admin-login.html`);
});