const express = require('express');
const router = express.Router();
const db = require('./db');

// Accueil - Liste des voyages
router.get('/accueil', (req, res) => {
    db.query("SELECT * FROM voyages ORDER BY date ASC, heure ASC", (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);
    });
});

// Sélection des sièges
router.post('/selection', (req, res) => {
    const { id_user, id_voyage, siege } = req.body;

    if (!id_user || !id_voyage || !siege) {
        return res.status(400).send('Données manquantes');
    }

    db.query("SELECT * FROM reservations WHERE id_voyage = ? AND siege = ? AND statut != 'annulé'",
        [id_voyage, siege],
        (err, results) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).send('Erreur serveur');
            }
            if (results.length > 0) {
                return res.status(409).send('Ce siège est déjà réservé');
            }

            db.query("INSERT INTO reservations (id_user, id_voyage, siege, statut) VALUES (?,?,?,?)",
                [id_user, id_voyage, siege, 'en attente'],
                (err, result) => {
                    if (err) {
                        console.error('Erreur SQL:', err);
                        return res.status(500).send('Erreur lors de la réservation');
                    }
                    res.json({
                        message: '✅ Siège réservé !',
                        reservationId: result.insertId
                    });
                });
        });
});

// Confirmation de réservation
router.put('/confirmation/:id', (req, res) => {
    const id = req.params.id;

    db.query("UPDATE reservations SET statut = 'confirmé' WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Réservation non trouvée');
        }
        res.json({ message: '✅ Réservation confirmée !' });
    });
});

// Historique des réservations
router.get('/historique/:id_user', (req, res) => {
    const id_user = req.params.id_user;

    db.query(
        `SELECT r.id, v.destination, v.date, v.heure, r.siege, r.statut
         FROM reservations r
         JOIN voyages v ON r.id_voyage = v.id
         WHERE r.id_user = ?
         ORDER BY v.date DESC, v.heure DESC`,
        [id_user],
        (err, results) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).send('Erreur serveur');
            }
            res.json(results);
        });
});

// ============ NOUVELLES ROUTES POUR LES MESSAGES ============

// Envoyer un message
router.post('/messages', (req, res) => {
    const { id_user, sujet, message } = req.body;

    if (!id_user || !sujet || !message) {
        return res.status(400).send('Tous les champs sont obligatoires');
    }

    db.query(
        'INSERT INTO messages (id_user, sujet, message, statut) VALUES (?, ?, ?, "non_lu")',
        [id_user, sujet, message],
        (err, result) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).send('Erreur lors de l\'envoi');
            }
            res.json({
                message: '✅ Message envoyé avec succès !',
                id: result.insertId
            });
        }
    );
});

// Récupérer les messages d'un client
router.get('/messages/:id_user', (req, res) => {
    const id_user = req.params.id_user;

    db.query(
        'SELECT * FROM messages WHERE id_user = ? ORDER BY date_envoi DESC',
        [id_user],
        (err, results) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).send('Erreur serveur');
            }
            res.json(results);
        }
    );
});

module.exports = router;