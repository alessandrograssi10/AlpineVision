const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const path = require('path');
const fs = require('fs');
const { createProduct, deleteProduct,updateProductPrice,updateProductDescription } = require('../models/products');

//ottieni lista prodotti
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

//ottieni foto specificando codice prodotto e colore
router.get('/photo', (req, res) => {
    const { codice, colore } = req.query;
    // Costruisci il percorso dell'immagine
    
    const imagePath = path.join(__dirname,'..', 'images', `${codice}`, `${codice}_${colore}.jpeg`);
    // Controlla se l'immagine esiste
    if (fs.existsSync(imagePath)) {
        // Se l'immagine esiste, inviala come risposta
        res.sendFile(imagePath);
    } else {
        // Se l'immagine non esiste, restituisci un errore 404
        res.status(404).json({ error: 'Immagine non trovata' });
    }
});

//crea prodotto
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const {codice, nome, prezzo, categoria,descrizione, colore}=req.body;
        const productId = await createProduct(codice, nome, prezzo, categoria,descrizione, colore);
        res.status(201).json({ _id: productId });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Error creating product" });
    }
});

//elimina prodotto
router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const result = await deleteProduct(productId);
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Prodotto eliminato con successo" });
        } else {
            res.status(404).json({ error: "Prodotto non trovato" });
        }
    } catch (error) {
        console.error("Errore nell'eliminazione del prodotto:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

//aggiornare prezzo prodotto
router.put('/price/:productId', async (req, res) => {
    const { productId } = req.params;
    const { newPrice } = req.body;

    if (isNaN(newPrice) || newPrice <= 0) {
        return res.status(400).json({ error: "Il nuovo prezzo deve essere un numero positivo" });
    }

    try {
        const result = await updateProductPrice(productId, newPrice);
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Prezzo del prodotto aggiornato con successo" });
        } else {
            res.status(404).json({ message: "Prodotto non trovato" });
        }
    } catch (error) {
        console.error("Errore nell'aggiornamento del prezzo del prodotto:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

//aggiornare descrizione prodotto
router.put('/description/:productId', async (req, res) => {
    const { productId } = req.params;
    const { newDescription } = req.body;

    if (!newDescription || newDescription.trim() === "") {
        return res.status(400).json({ error: "La nuova descrizione non può essere vuota" });
    }

    try {
        const result = await updateProductDescription(productId, newDescription);
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Descrizione del prodotto aggiornata con successo" });
        } else {
            res.status(404).json({ message: "Prodotto non trovato" });
        }
    } catch (error) {
        console.error("Errore nell'aggiornamento della descrizione del prodotto:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});



module.exports = router;
