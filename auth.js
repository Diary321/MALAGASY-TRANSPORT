const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./db');
const crypto = require('crypto');

const SECRET = 'malagasy_secret_2026';

// Fonction pour hacher le mot de passe avec SHA256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Register
router.post('/register', (req, res) => {
    const { nom, email, mot_de_passe, role = 'client' } = req.body;

    if (!nom || !email || !mot_de_passe) {
        return res.status(400).send('Tous les champs sont obligatoires');
    }

    const hash = hashPassword(mot_de_passe);

    db.query('INSERT INTO users (nom, email, mot_de_passe, role) VALUES (?,?,?,?)',
        [nom, email, hash, role],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send('Cet email est déjà utilisé');
                }
                console.error('Erreur SQL:', err);
                return res.status(500).send('Erreur lors de l\'inscription');
            }
            res.json({
                message: '✅ Utilisateur enregistré !',
                user: { id: result.insertId, nom, email, role }
            });
        });
});

// Login
router.post('/login', (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).send('Email et mot de passe requis');
    }

    const hash = hashPassword(mot_de_passe);

    db.query('SELECT * FROM users WHERE email = ? AND mot_de_passe = ?', [email, hash], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (results.length === 0) {
            return res.status(401).send('Email ou mot de passe incorrect');
        }

        const user = results[0];
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie ✅',
            token,
            user: { id: user.id, role: user.role, nom: user.nom, email: user.email }
        });
    });
});

module.exports = router;