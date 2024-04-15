const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { createUser, deleteUser, updateUserPassword } = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const users = await usersCollection.find({}).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error("Errore nel recupero degli utenti:", error);
        res.status(500).json({ error: "Errore nel recupero degli utenti" });
    }
});

// Route per creare un nuovo utente
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await createUser(username, password);
        res.status(201).json({ message: "Utente creato con successo", userId: result.insertedId });
    } catch (error) {
        console.error("Errore nella creazione dell'utente:", error);
        res.status(500).json({ error: "Errore nella creazione dell'utente" });
    }
});

// Route per eliminare un utente
router.delete('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const result = await deleteUser(userId);
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Utente eliminato con successo" });
        } else {
            res.status(404).json({ error: "Utente non trovato" });
        }
    } catch (error) {
        console.error("Errore nell'eliminazione dell'utente:", error);
        res.status(500).json({ error: "Errore nell'eliminazione dell'utente" });
    }
});

// Route per modificare la password di un utente
router.patch('/:userId/password', async (req, res) => {
    const userId = req.params.userId;
    const { newPassword } = req.body;
    try {
        const result = await updateUserPassword(userId, newPassword);
        if (result.matchedCount === 1) {
            res.status(200).json({ message: "Password aggiornata con successo" });
        } else {
            res.status(404).json({ error: "Utente non trovato" });
        }
    } catch (error) {
        console.error("Errore nell'aggiornamento della password dell'utente:", error);
        res.status(500).json({ error: "Errore nell'aggiornamento della password dell'utente" });
    }
});

module.exports = router;

