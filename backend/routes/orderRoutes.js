const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb'); // Assicurati di avere questo import
const { createOrder, updateOrderStatus,createOrderGuest } = require('../models/orders');


router.post('/createOrder', async (req, res) => {
    const { userId, productId, color, quantity, type , nome, cognome, città, indirizzo, telefono} = req.body;

    try {
        const db = getDb();
        let itemDetails, productDetails;

        if (type === 'product') {
            // Ottieni dettagli della variante
            itemDetails = await db.collection('Variants').findOne({
                productId: new ObjectId(productId),
                colore: color
            });
            // Ottieni dettagli del prodotto per il prezzo
            productDetails = await db.collection('Products').findOne({ _id: new ObjectId(productId) });
        } else if (type === 'accessory') {
            // Gli accessori hanno prezzo nel loro documento
            itemDetails = await db.collection('Accessories').findOne({ _id: new ObjectId(productId) });
            productDetails = itemDetails;
        }

        if (!itemDetails || itemDetails.quantita < quantity) {
            return res.status(400).json({ message: `${type} non disponibile o quantità non sufficiente` });
        }

        if (!productDetails || !productDetails.prezzo) {
            return res.status(404).json({ message: `Prezzo per il ${type} non trovato` });
        }

        const items = [{
            productId: productId,
            color: type === 'product' ? color : undefined,
            quantity: quantity,
            total: productDetails.prezzo * quantity,
            type: type,
        }];

        const orderId = await createOrder(userId, items, nome, cognome, città, indirizzo, telefono);

        // Aggiornamento dello stato dell'ordine con delay
        setTimeout(async () => {
            await updateOrderStatus(orderId, 'shipped', 'shippedAt');
            console.log("shipped");
        }, 6000); // 6 secondi

        setTimeout(async () => {
            await updateOrderStatus(orderId, 'delivered', 'deliveredAt');
            console.log("delivered");
        }, 24000); // 24 secondi

        res.status(201).json({ message: "Ordine creato con successo", orderId: orderId });
    } catch (error) {
        console.error("Errore nella creazione dell'ordine:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


router.post('/createOrderFromCart', async (req, res) => {
    const { userId, nome, cognome,città, indirizzo,telefono } = req.body;

    try {
        const db = getDb();
        const cartsCollection = db.collection('Carts');
        const cart = await cartsCollection.findOne({ userId: userId });

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(404).json({ message: "Carrello non trovato o vuoto" });
        }

        // Controlla la disponibilità degli item nel carrello
        for (const item of cart.items) {
            const collectionName = item.type === 'product' ? 'Variants' : 'Accessories';
            const collection = db.collection(collectionName);
            const query = item.type === 'product' ? { productId: new ObjectId(item.productId), colore: item.color } : { _id: new ObjectId(item.productId) };
            const inventoryItem = await collection.findOne(query);

            /*if (!inventoryItem || inventoryItem.quantita < item.quantity) {
                return res.status(400).json({ message: Uno o più ${item.type === 'product' ? 'prodotti' : 'accessori'} non disponibili o con quantità insufficiente });
            }*/
        }

        // Crea l'ordine
        const orderId = await createOrder(userId, cart.items, nome, cognome, città, indirizzo, telefono);

        // Rimuovi tutti gli item dal carrello
        await cartsCollection.updateOne({ userId: userId }, { $set: { items: [], totalPrice: 0, updatedAt: new Date() } });

        // Aggiornamenti di stato dell'ordine programmata
        setTimeout(async () => {
            await updateOrderStatus(orderId, 'shipped', 'shippedAt');
            console.log("shipped");
        }, 6000); // 6 secondi

        setTimeout(async () => {
            await updateOrderStatus(orderId, 'delivered', 'deliveredAt');
            console.log("delivered");
        }, 24000); // 24 secondi

        res.status(201).json({ message: "Ordine creato con successo e carrello svuotato", orderId: orderId });
    } catch (error) {
        console.error("Errore nella creazione dell'ordine dal carrello:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

router.post('/createOrderGuest', async (req, res) => {
    const { productId, color, quantity, type, nome, cognome, città, indirizzo, telefono, email } = req.body;

    try {
        const db = getDb();
        let itemDetails, productDetails;

        if (type === 'product') {
            itemDetails = await db.collection('Variants').findOne({
                productId: new ObjectId(productId),
                colore: color
            });
            productDetails = await db.collection('Products').findOne({ _id: new ObjectId(productId) });
        } else if (type === 'accessory') {
            itemDetails = await db.collection('Accessories').findOne({ _id: new ObjectId(productId) });
            productDetails = itemDetails;
        }

        if (!itemDetails || itemDetails.quantita < quantity) {
            return res.status(400).json({ message: `${type} non disponibile o quantità non sufficiente` });
        }

        if (!productDetails || !productDetails.prezzo) {
            return res.status(404).json({ message: `Prezzo per il ${type} non trovato` });
        }

        const items = [{
            productId: productId,
            color: type === 'product' ? color : undefined,
            quantity: quantity,
            total: productDetails.prezzo * quantity,
            type: type,
        }];

        const orderId = await createOrderGuest( items, nome, cognome, città, indirizzo, telefono, email);

        res.status(201).json({ message: "Ordine creato con successo", orderId: orderId });
    } catch (error) {
        console.error("Errore nella creazione dell'ordine:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

router.post('/createOrderFromCartGuest', async (req, res) => {
    const { virtualCart,nome, cognome, città, indirizzo, telefono, email } = req.body;

    try {
        const cart = { items: virtualCart };//await cartsCollection.findOne({ userId: userId });

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(404).json({ message: "Carrello non trovato o vuoto" });
        }

        const orderId = await createOrderGuest( cart.items, nome, cognome, città, indirizzo, telefono, email);

        res.status(201).json({ message: "Ordine creato con successo e carrello svuotato", orderId: orderId });
    } catch (error) {
        console.error("Errore nella creazione dell'ordine dal carrello:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


router.get('/getOrdersByUserId/:userId', async (req, res) => {
    const userId = req.params.userId;

    
    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    try {
        const db = getDb();
        const ordersCollection = db.collection('Orders');

        
        const orders = await ordersCollection.find({ userId: new ObjectId(userId) }).toArray();

        if (orders.length === 0) {
            //return res.status(404).json({ message: "No orders found for this user" });
            return;
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Errore nel recupero degli ordini:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


router.post('/createOrderGuest', async (req, res) => {
    const { userId, productId, color, quantity, type } = req.body;

    try {
        const db = getDb();
        let itemDetails, productDetails;

        if (type === 'product') {
            // Ottieni dettagli della variante
            itemDetails = await db.collection('Variants').findOne({
                productId: new ObjectId(productId),
                colore: color
            });
            // Ottieni dettagli del prodotto per il prezzo
            productDetails = await db.collection('Products').findOne({ _id: new ObjectId(productId) });
        } else if (type === 'accessory') {
            // Gli accessori hanno prezzo nel loro documento
            itemDetails = await db.collection('Accessories').findOne({ _id: new ObjectId(productId) });
            productDetails = itemDetails;
        }

        if (!itemDetails || itemDetails.quantita < quantity) {
            return res.status(400).json({ message: `${type} non disponibile o quantità non sufficiente` });
        }

        if (!productDetails || !productDetails.prezzo) {
            return res.status(404).json({ message: `Prezzo per il ${type} non trovato` });
        }

        const items = [{
            productId: productId,
            color: type === 'product' ? color : undefined,
            quantity: quantity,
            total: productDetails.prezzo * quantity,
            type: type,
        }];

        const orderId = await createOrder(userId, items);

        // Aggiornamento dello stato dell'ordine con delay
        setTimeout(async () => {
            await updateOrderStatus(userId, 'shipped', 'shippedAt');
            console.log("shipped");
        }, 6000); // 6 secondi

        setTimeout(async () => {
            await updateOrderStatus(userId, 'delivered', 'deliveredAt');
            console.log("delivered");
        }, 24000); // 24 secondi

        res.status(201).json({ message: "Ordine creato con successo", userId: orderId });
    } catch (error) {
        console.error("Errore nella creazione dell'ordine:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


module.exports = router;
