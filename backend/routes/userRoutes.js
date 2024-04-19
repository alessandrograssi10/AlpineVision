const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { createUser, deleteUser, updateUserPassword, setPhone, setAddress, findUserByEmail } = require('../models/user');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');


/*

GET

*/

//rotta per mostrare gli users
router.get('/', async (req, res) => { //funziona
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


// Rotta per ottenere i dati di un singolo utente tramite ID
router.get('/:userId', async (req, res) => { //funziona
    const { userId } = req.params;  
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) }); 

        if (!user) {
            res.status(404).json({ error: "Utente non trovato" });  
        } else {
            res.status(200).json(user);  
        }
    } catch (error) {
        console.error("Errore nel recupero dell'utente:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

// Ottieni tutti gli ordini per un utente
router.get('/orders/:userId', async (req, res) => { //ancora devo fare ordini
    const { userId } = req.params;
    try {
        const db = getDb();
        const orders = await db.collection('Orders').find({ customerId: new ObjectId(userId) }).toArray();
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ message: "No orders found for this user" });
        }
    } catch (error) {
        console.error("Error retrieving orders for user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




/*


POST


*/



router.post('/addUser', async (req, res) => { //funziona
    console.log(req.body);
    const { nome,cognome, email, password,dataNascita} = req.body;
    try {
        const result = await createUser(nome,cognome, email, password,dataNascita);
        console.log(result.userId);

        const token = jwt.sign(
            { userId: result.userId, email: email },
              process.env.JWT_SECRET,
            { expiresIn: '1h' }  
        );

        res.status(201).json({
            message: "Utente creato con successo",
            userId: result.userId,
            token: token
        });
    } catch (error) {
        console.error("Errore nella creazione dell'utente:", error);
        if (error.message === 'Esiste già un utente con questa email') {
            res.status(409).json({ error: error.message });  // 409 Conflict
        } else {
            res.status(500).json({ error: "Errore nella creazione dell'utente" });
        }
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
            process.env.JWT_SECRET,   // Segreto per firmare il token
            { expiresIn: '1h' }  // Opzioni: token valido per 1 ora
        );
        // Invia il token al client
        res.status(200).json({ message: "Login riuscito", token: token, userId: user._id });
    } catch (error) {
        console.error("Errore nel login:", error);
        res.status(500).json({ error: "Errore nel processo di login" });
    }
});


/*

DELETE

*/

// Route per eliminare un utente 
router.delete('/:userId', async (req, res) => { //funziona

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



/*

PATCH

*/

// Route per modificare la password di un utente
router.patch('/:userId/password', async (req, res) => {//funziona
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


/*

PUT

*/
// Rotta per aggiornare il numero di telefono di un utente o crearlo se non c'è
router.put('/setPhone/:userId', async (req, res) => { //funziona
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

// Rotta per aggiornare l'indirizzo di un utente o crearlo se non c'è
router.put('/setAddress/:userId', async (req, res) => { //funziona
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






module.exports = router;

