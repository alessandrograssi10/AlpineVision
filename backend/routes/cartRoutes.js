const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb'); // Assicurati di avere questo import

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const db = getDb();
        const cartCollection = db.collection('Carts');
        const cart = await cartCollection.findOne({ userId: userId });

        if (cart) {
            res.status(200).json(cart.items);
        } else {
            res.status(404).json({ error: "Carrello non trovato" });
        }
    } catch (error) {
        console.error("Errore nel recupero del carrello:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


// Helper function to calculate total price
async function calculateTotalPrice(items, db) {
    let totalPrice = 0;
    for (let item of items) {
        const product = await db.collection('Products').findOne({ _id: new ObjectId(item.productId) });
        console.log("trovato : "+ product+"\n");
        if (product) {
            totalPrice += (product.prezzo * item.quantity);
        }
    }
    return totalPrice;
}

// Aggiungi un prodotto al carrello
router.post('/add', async (req, res) => {
    const { userId, productId, color, quantity } = req.body;
    try {
        const db = getDb();
        const cartCollection = db.collection('Carts');
        const productCollection = db.collection('Products');
        
        let cart = await cartCollection.findOne({ userId: userId });
        const product = await productCollection.findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ message: "Prodotto non trovato" });
        }

        const itemTotal = product.prezzo * quantity;

        if (!cart) {
            // Se non esiste un carrello, crealo con un singolo prodotto
            const newItem = {
                productId,
                color,
                quantity,
                total: itemTotal
            };
            cart = {
                userId,
                items: [newItem],
                totalPrice: itemTotal, // Inizializza il prezzo totale del carrello con il totale dell'articolo
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await cartCollection.insertOne(cart);
        } else {
            // Altrimenti, aggiorna il carrello esistente
            const itemIndex = cart.items.findIndex(item => item.productId === productId && item.color === color);
            if (itemIndex > -1) {
                // Prodotto già nel carrello, aggiorna la quantità e il totale
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].total += itemTotal;
            } else {
                // Prodotto non nel carrello, aggiungilo
                const newItem = {
                    productId,
                    color,
                    quantity,
                    total: itemTotal
                };
                cart.items.push(newItem);
            }
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0); // Ricalcola il prezzo totale del carrello
            cart.updatedAt = new Date();
            await cartCollection.updateOne({ _id: cart._id }, { $set: { items: cart.items, totalPrice: cart.totalPrice, updatedAt: cart.updatedAt } });
        }
        res.status(200).json({ message: "Carrello aggiornato con successo", totalPrice: cart.totalPrice });
    } catch (error) {
        console.error("Errore nell'aggiunta al carrello:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

// Rimuovi un prodotto dal carrello
router.delete('/remove', async (req, res) => {
    const { userId, productId, color } = req.body;
    try {
        const db = getDb();
        const cartCollection = db.collection('Carts');
        let cart = await cartCollection.findOne({ userId: userId });

        if (cart) {
            const newItems = cart.items.filter(item => !(item.productId === productId && item.color === color));
            const totalPrice = await calculateTotalPrice(newItems, db);
            await cartCollection.updateOne({ _id: cart._id }, { $set: { items: newItems, totalPrice, updatedAt: new Date() } });
            res.status(200).json({ message: "Prodotto rimosso con successo", totalPrice });
        } else {
            res.status(404).json({ error: "Carrello non trovato" });
        }
    } catch (error) {
        console.error("Errore nella rimozione del prodotto dal carrello:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

module.exports = router;
