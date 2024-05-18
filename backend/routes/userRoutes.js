const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { createUser, deleteUser, updateUserPassword, setPhone, setAddress, findUserByEmail, updateUserRole,getUserRole } = require('../models/user');
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
        res.status(200).json({ message: "Login riuscito", token: token, userId: user._id, ruolo: user.ruolo});
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
    const { newPassword , oldPassword} = req.body;
    try {
        const result = await updateUserPassword(userId,oldPassword, newPassword);
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

// Route per modificare il ruolo di un utente
router.patch('/:userId/role', async (req, res) => {
    const userId = req.params.userId;
    const { newRole } = req.body;

    // Validate newRole input
    const validRoles = ['user', 'editor-blog', 'editor-prodotti', 'admin'];
    if (!validRoles.includes(newRole)) {
        return res.status(400).json({ error: "Ruolo non valido" });
    }

    try {
        const result = await updateUserRole(userId, newRole);
        if (result.matchedCount === 1) {
            res.status(200).json({ message: "Ruolo aggiornato con successo" });
        } else {
            res.status(404).json({ error: "Utente non trovato" });
        }
    } catch (error) {
        console.error("Errore nell'aggiornamento del ruolo dell'utente:", error);
        res.status(500).json({ error: "Errore nell'aggiornamento del ruolo dell'utente" });
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



router.get('/:userId/role', verifyTokenAndUserId, async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const role = await getUserRole(userId);
        res.status(200).json({ role: role, message: "Ruolo recuperato con successo" });
    } catch (error) {
        console.error("Errore nel recupero del ruolo dell'utente:",error.message);
        if (error.message === 'Utente non trovato') {
            res.status(404).json({ error: "Utente non trovato" });
        } else {
            res.status(500).json({ error: "Errore interno del server" });
        }
    }
});

//Rotte e funzioni aggiuntive (sicurezza)

function verifyTokenAndUserId(req, res, next) {
    const userId = req.params.userId;
    const token = req.headers['authorization']?.split(' ')[1]; // Estrae il token dall'header 'Authorization'

    if (!token) {
        return res.status(401).json({ error: "Token non fornito" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token non valido o scaduto" });
        }

        // Verifica se l'ID nel token decodificato corrisponde all'ID nella richiesta
        if (decoded.userId !== userId) {
            return res.status(403).json({ error: "ID utente non corrisponde al token fornito" });
        }

        try {
            const db = getDb();
            const usersCollection = db.collection('Users');
            const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

            if (!user) {
                return res.status(404).json({ error: "Utente non trovato" });
            }

            req.user = user; // Salva l'utente nella richiesta per uso in downstream middlewares o handlers
            next();
        } catch (error) {
            console.error("Errore durante la verifica dell'utente:", error);
            res.status(500).json({ error: "Errore interno del server" });
        }
    });
}

// Rotta GET per verificare l'ID utente e il token JWT
router.get('/verify/:userId', verifyTokenAndUserId, (req, res) => {
    // Se il middleware non termina la richiesta, significa che l'ID e il token sono validi
    res.status(200).json({
        message: "ID utente e token sono validi",
        userId: req.params.userId,
        userInfo: req.user
    });
});
module.exports = router;

