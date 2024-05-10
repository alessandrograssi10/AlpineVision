const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

// Retrieve the list of favorite products for a user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const db = getDb();
        const favouritesCollection = db.collection('Favourites');
        const favourites = await favouritesCollection.findOne({ userId: userId });

        if (favourites) {
            res.status(200).json({ favourites: favourites.products });
        } else {
            res.status(404).json({ message: "Nessun preferito trovato" });
        }
    } catch (error) {
        console.error("Errore nel recupero dei preferiti:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

// Add a product to the user's favorites
router.post('/add', async (req, res) => {
    const { userId, productId, type } = req.body;
    const productEntry = { productId, type }; // Store product with its type
    try {
        const db = getDb();
        const favouritesCollection = db.collection('Favourites');
        let favourites = await favouritesCollection.findOne({ userId: userId });

        if (favourites) {
            // Prevent adding duplicates
            if (!favourites.products.some(p => p.productId === productId && p.type === type)) {
                favourites.products.push(productEntry);
                await favouritesCollection.updateOne({ userId: userId }, { $set: { products: favourites.products } });
            }
        } else {
            // If no favorites exist, create a new entry
            favourites = {
                userId,
                products: [productEntry]
            };
            await favouritesCollection.insertOne(favourites);
        }
        res.status(200).json({ message: "Preferito aggiunto con successo" });
    } catch (error) {
        console.error("Errore nell'aggiunta ai preferiti:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

// Remove a product from the user's favorites
router.delete('/remove', async (req, res) => {
    const { userId, productId, type } = req.body;
    try {
        const db = getDb();
        const favouritesCollection = db.collection('Favourites');
        let favourites = await favouritesCollection.findOne({ userId: userId });

        if (favourites && favourites.products.some(p => p.productId === productId && p.type === type)) {
            const newProducts = favourites.products.filter(p => !(p.productId === productId && p.type === type));
            await favouritesCollection.updateOne({ userId: userId }, { $set: { products: newProducts } });
            res.status(200).json({ message: "Preferito rimosso con successo" });
        } else {
            res.status(404).json({ message: "Prodotto non trovato nei preferiti" });
        }
    } catch (error) {
        console.error("Errore nella rimozione dai preferiti:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

module.exports = router;
