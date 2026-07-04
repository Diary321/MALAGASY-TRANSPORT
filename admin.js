const express = require('express');
const router = express.Router();
const db = require('./db');

// Dashboard - Statistiques
router.get('/dashboard', (req, res) => {
    db.query("SELECT COUNT(*) AS total_users FROM users", (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur serveur');
        }
        db.query("SELECT COUNT(*) AS total_reservations FROM reservations", (err, reservations) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur serveur');
            }
            db.query("SELECT COUNT(*) AS pending_reservations FROM reservations WHERE statut = 'en attente'", (err, pending) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erreur serveur');
                }
                // Compter les messages non lus
                db.query("SELECT COUNT(*) AS unread_messages FROM messages WHERE statut = 'non_lu'", (err, unread) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Erreur serveur');
                    }
                    res.json({
                        users: users[0].total_users,
                        reservations: reservations[0].total_reservations,
                        pending: pending[0].pending_reservations,
                        unread: unread[0].unread_messages
                    });
                });
            });
        });
    });
});

// Récupérer toutes les réservations
router.get('/reservations', (req, res) => {
    db.query(`
        SELECT r.id, r.siege, r.statut, 
               u.nom as client_nom, u.email as client_email,
               v.destination, v.date, v.heure, v.prix
        FROM reservations r
        JOIN users u ON r.id_user = u.id
        JOIN voyages v ON r.id_voyage = v.id
        ORDER BY r.id DESC
    `, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);
    });
});

// Récupérer les réservations en attente
router.get('/reservations/pending', (req, res) => {
    db.query(`
        SELECT r.id, r.siege, r.statut, 
               u.nom as client_nom, u.email as client_email,
               v.destination, v.date, v.heure, v.prix
        FROM reservations r
        JOIN users u ON r.id_user = u.id
        JOIN voyages v ON r.id_voyage = v.id
        WHERE r.statut = 'en attente'
        ORDER BY r.id DESC
    `, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);
    });
});

// Confirmer une réservation
router.put('/reservations/confirm/:id', (req, res) => {
    const id = req.params.id;

    db.query("UPDATE reservations SET statut = 'confirmé' WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur lors de la confirmation');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Réservation non trouvée');
        }
        res.json({ message: '✅ Réservation confirmée !' });
    });
});

// Annuler une réservation
router.put('/reservations/cancel/:id', (req, res) => {
    const id = req.params.id;

    db.query("UPDATE reservations SET statut = 'annulé' WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur lors de l\'annulation');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Réservation non trouvée');
        }
        res.json({ message: '❌ Réservation annulée !' });
    });
});

// ============ NOUVELLES ROUTES POUR LES MESSAGES ============

// Récupérer tous les messages pour l'admin
router.get('/messages', (req, res) => {
    db.query(`
        SELECT m.*, u.nom as client_nom, u.email as client_email
        FROM messages m
        JOIN users u ON m.id_user = u.id
        ORDER BY m.date_envoi DESC
    `, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);
    });
});

// Récupérer les messages non lus
router.get('/messages/unread', (req, res) => {
    db.query(`
        SELECT m.*, u.nom as client_nom, u.email as client_email
        FROM messages m
        JOIN users u ON m.id_user = u.id
        WHERE m.statut = 'non_lu'
        ORDER BY m.date_envoi DESC
    `, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);
    });
});

// Marquer un message comme lu
router.put('/messages/read/:id', (req, res) => {
    const id = req.params.id;

    db.query("UPDATE messages SET statut = 'lu' WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Message non trouvé');
        }
        res.json({ message: '✅ Message marqué comme lu' });
    });
});

// Répondre à un message
router.post('/messages/reply/:id', (req, res) => {
    const id = req.params.id;
    const { reponse } = req.body;

    if (!reponse) {
        return res.status(400).send('La réponse est obligatoire');
    }

    db.query(
        "UPDATE messages SET reponse = ?, statut = 'repondu', date_reponse = NOW() WHERE id = ?",
        [reponse, id],
        (err, result) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).send('Erreur lors de l\'envoi de la réponse');
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Message non trouvé');
            }
            res.json({ message: '✅ Réponse envoyée !' });
        }
    );
});

// Gestion voyages - Ajouter
router.post('/gestion/voyages', (req, res) => {
    const { destination, date, heure, prix } = req.body;

    if (!destination || !date || !heure || !prix) {
        return res.status(400).send('Tous les champs sont obligatoires');
    }

    db.query("INSERT INTO voyages (destination, date, heure, prix) VALUES (?,?,?,?)",
        [destination, date, heure, prix],
        (err, result) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).send('Erreur lors de l\'ajout');
            }
            res.json({ message: '✅ Voyage ajouté !', id: result.insertId });
        });
});

// Gestion voyages - Supprimer
router.delete('/gestion/voyages/:id', (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM voyages WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur serveur');
        }
        if (results.length === 0) {
            return res.status(404).send('Voyage non trouvé');
        }

        db.query("DELETE FROM voyages WHERE id = ?", [id], (err) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).send('Erreur lors de la suppression');
            }
            res.json({ message: '✅ Voyage supprimé !' });
        });
    });
});

module.exports = router;