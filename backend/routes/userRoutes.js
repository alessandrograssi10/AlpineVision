const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { createUser, deleteUser, updateUserPassword, setPhone, setAddress, findUserByEmail } = require('../models/user');
const jwt = require('jsonwebtoken');

//rotta per mostrare gli users
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

// Route per creare un nuovo utente caricare nella richiesta mettere in body:
//{
//     "username": "..",
//     "email": ".."
//     "password": ".."
// } e selezionare il formato json invece che text/plain
router.post('/addUser', async (req, res) => {
    console.log(req.body);
    const { username,email, password } = req.body;
    try {
        const result = await createUser(username,email, password);
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
// la password va nel body in formato json come detto per create user
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

// Rotta per aggiornare il numero di telefono di un utente
router.put('/setPhone/:userId', async (req, res) => {
    const { userId } = req.params;
    const { newPhone } = req.body;
    try {
        const result = await setPhone(userId, newPhone);
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Numero di telefono aggiornato con successo" });
        } else {
            res.status(404).json({ message: "Nessun utente trovato con l'ID fornito" });
        }
    } catch (error) {
        console.error("Errore nell'aggiornamento del numero di telefono:", error);
        res.status(500).json({ error: "Errore nell'aggiornamento del numero di telefono" });
    }
});

// Rotta per aggiornare l'indirizzo di un utente
router.put('/setAddress/:userId', async (req, res) => {
    const { userId } = req.params;
    const { newAddress } = req.body;
    try {
        const result = await setAddress(userId, newAddress);
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Indirizzo aggiornato con successo" });
        } else {
            res.status(404).json({ message: "Nessun utente trovato con l'ID fornito" });
        }
    } catch (error) {
        console.error("Errore nell'aggiornamento dell'indirizzo:", error);
        res.status(500).json({ error: "Errore nell'aggiornamento dell'indirizzo" });
    }
});

// Rotta di login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "Utente non trovato" });
        }
        if (password !== user.password) {
            return res.status(401).json({ error: "Credenziali non valide" });
        }
        // Genera il JWT
        const token = jwt.sign(
            { userId: user._id }, // Payload
            'your_secret_key',   // Segreto per firmare il token
            { expiresIn: '1h' }  // Opzioni: token valido per 1 ora
        );
        // Invia il token al client
        res.status(200).json({ message: "Login riuscito", token: token, userId: user._id });
    } catch (error) {
        console.error("Errore nel login:", error);
        res.status(500).json({ error: "Errore nel processo di login" });
    }
});



module.exports = router;

