const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb'); // Assicurati di avere questo import
const { createOrder, updateOrderStatus } = require('../models/orders');


router.post('/createOrder', async (req, res) => {
    const { userId, productId, color, quantity } = req.body;

    try {
        const db = getDb();
        console.log(new ObjectId(userId));
        const variantCollection = db.collection('Variants');
        const variant = await variantCollection.findOne({
            productId: new ObjectId(productId),
            colore: color
        });
        if (!variant || variant.quantita < quantity) {
            return res.status(400).json({ message: "Variante non disponibile o quantità non sufficiente" });
        }

        const productCollection = db.collection('Products');
        const product = await productCollection.findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ message: "Prodotto non trovato" });
        }

        const items = [{
            productId: productId,
            color: color,
            quantity: quantity,
            total: product.prezzo * quantity
        }];
        const orderId = await createOrder(userId, items);

        setTimeout(async () => {
            await updateOrderStatus(orderId, 'shipped', 'shippedAt');
            console.log("shipped");
        }, 6000); 

        setTimeout(async () => {
            await updateOrderStatus(orderId, 'delivered', 'deliveredAt');
            console.log("delivered");
        }, 24000); // 4 minuti

        res.status(201).json({ message: "Ordine creato con successo", orderId: orderId });
    } catch (error) {
        console.error("Errore nella creazione dell'ordine:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});



router.post('/createOrderFromCart', async (req, res) => {
    const { userId } = req.body;

    try {
        const db = getDb();
        const cartsCollection = db.collection('Carts');
        const cart = await cartsCollection.findOne({ userId:  userId });

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(404).json({ message: "Carrello non trovato o vuoto" });
        }

        const variantCollection = db.collection('Variants');
       
        for (const item of cart.items) {
            console.log(item.productId);
            const variant = await variantCollection.findOne({
                productId: new ObjectId(item.productId),
                colore: item.color
            });

            if (!variant || variant.quantita < item.quantity) {
                return res.status(400).json({ message: "Uno o più articoli non disponibili o con quantità insufficiente" });
            }
        }

        const orderId = await createOrder(userId, cart.items);

    
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
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Errore nel recupero degli ordini:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


module.exports = router;
