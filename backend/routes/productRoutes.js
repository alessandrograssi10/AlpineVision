const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const path = require('path');
const fs = require('fs');



router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const productsCollection = db.collection('Products');
        const products = await productsCollection.find({}).toArray();
        res.status(200).json(products);
    } catch (error) {
        console.error("Errore nel recupero degli utenti:", error);
        res.status(500).json({ error: "Errore nel recupero degli utenti" });
    }
});

router.get('/photo', (req, res) => {
    const { codice, colore } = req.query;
    // Costruisci il percorso dell'immagine
    
    const imagePath = path.join(__dirname,'..', 'images', `${codice}`, `${codice}_${colore}.jpeg`);
    console.log("##################################################");
    console.log(imagePath);
    // Controlla se l'immagine esiste
    if (fs.existsSync(imagePath)) {
        // Se l'immagine esiste, inviala come risposta
        res.sendFile(imagePath);
    } else {
        // Se l'immagine non esiste, restituisci un errore 404
        res.status(404).json({ error: 'Immagine non trovata' });
    }
});

module.exports = router;


module.exports = router;
