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

router.post('/add', async (req, res) => {
    const { userId, productId, color, quantity, type } = req.body;
    try {
        const db = getDb();
        const cartCollection = db.collection('Carts');
        const collection = db.collection(type === 'product' ? 'Products' : 'Accessories');

        let cart = await cartCollection.findOne({ userId: userId });
        const item = await collection.findOne({ _id: new ObjectId(productId) });

        if (!item) {
            return res.status(404).json({ message: type === 'product' ? "Prodotto non trovato" : "Accessorio non trovato" });
        }

        const itemTotal = item.prezzo * quantity;
        
        if (!cart) {
            // Se non esiste un carrello, crealo con un singolo prodotto
            //                productId,

            const newItem = {
                type,
                productId,
                color: type === 'product' ? color : undefined,
                quantity,
                total: itemTotal
            };
            cart = {
                userId,
                items: [newItem],
                totalPrice: itemTotal,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await cartCollection.insertOne(cart);
        } else {
            // Cerca l'item nel carrello
            const itemIndex = cart.items.findIndex(item => item.productId === productId && item.type === type && (type === 'product' ? item.color === color : true));

            if (itemIndex > -1) {
                // Aggiorna la quantità e il totale dell'item esistente
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].total += itemTotal;
            } else {
                // Aggiungi un nuovo item se non esiste
                cart.items.push({
                    type,
                    productId,
                    color: type === 'product' ? color : undefined,
                    quantity,
                    total: itemTotal
                });
            }
            // Ricalcola il prezzo totale del carrello
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
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
    const { userId, productId, color, type } = req.body;
    try {
        const db = getDb();
        const cartCollection = db.collection('Carts');
        let cart = await cartCollection.findOne({ userId: userId });

        if (cart) {
            const newItems = cart.items.filter(item => !(item.productId === productId && (type === 'product' ? item.color === color : true)));
            const totalPrice = newItems.reduce((sum, item) => sum + item.total, 0);
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




// Modifica la quantità di un prodotto o accessorio nel carrello
router.patch('/updateQuantity', async (req, res) => {
    const { userId, productId, color, quantity, type } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: "La quantità deve essere almeno 1" });
    }

    try {
        const db = getDb();
        const cartCollection = db.collection('Carts');
        const collection = db.collection(type === 'product' ? 'Products' : 'Accessories');

        let cart = await cartCollection.findOne({ userId: userId });
        const item = await collection.findOne({ _id: new ObjectId(productId) });

        if (!item) {
            return res.status(404).json({ message: type === 'product' ? "Prodotto non trovato" : "Accessorio non trovato" });
        }

        if (!cart) {
            return res.status(404).json({ message: "Carrello non trovato" });
        }

        const itemIndex = cart.items.findIndex(i => i.productId === productId && i.type === type && (type === 'product' ? i.color === color : true));

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Articolo non trovato nel carrello" });
        }

        // Aggiorna la quantità e il totale per l'articolo trovato
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].total = item.prezzo * quantity;

        // Ricalcola il prezzo totale del carrello
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
        cart.updatedAt = new Date();

        await cartCollection.updateOne({ _id: cart._id }, { $set: { items: cart.items, totalPrice: cart.totalPrice, updatedAt: cart.updatedAt } });

        res.status(200).json({ message: "Quantità aggiornata con successo", totalPrice: cart.totalPrice });
    } catch (error) {
        console.error("Errore nell'aggiornamento della quantità nel carrello:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});




module.exports = router;
