const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');

<<<<<<< HEAD
async function createOrder(userId, items, nome, cognome, città, indirizzo, telefono) {
    const db = getDb();
    const order = {
        userId: new ObjectId(userId),
        items: items,
        status: 'received', 
        createdAt: new Date(),
        shippedAt: null,
        deliveredAt: null,
        nome: nome,
        cognome: cognome,
        città: città,
        indirizzo: indirizzo,
        telefono: telefono

        
    };
    const result = await db.collection('Orders').insertOne(order);
    return result.insertedId;
}

// Funzione per creare un ordine per un ospite (guest)
async function createOrderGuest(items, nome, cognome, città, indirizzo, telefono, email) {
    const db = getDb();
    // Genera un nuovo ObjectId per un ospite
    const guestUserId = new ObjectId(); 
    const order = {
        userId: guestUserId,
        items: items,
        status: 'received',
        createdAt: new Date(),
        shippedAt: null,
        deliveredAt: null,
        nome: nome,
        cognome: cognome,
        città: città,
        indirizzo: indirizzo,
        telefono: telefono,
        email: email // Aggiunto campo email
    };
    const result = await db.collection('Orders').insertOne(order);
    return result.insertedId;
}

async function updateOrderStatus(orderId, status, dateField) {
    const db = getDb();
    const update = {
        $set: {
            status: status,
            [dateField]: new Date()
        }
    };
    const result = await db.collection('Orders').updateOne({ _id: new ObjectId(orderId) }, update);
    return result.modifiedCount;
=======
async function createOrder(orderData) {
    const db = getDb();
    const result = await db.collection('Orders').insertOne(orderData);
    return result.insertedId;
}

async function getOrderById(orderId) {
    const db = getDb();
    const order = await db.collection('Orders').findOne({ _id: new ObjectId(orderId) });
    return order;
}

async function updateOrder(orderId, updateData) {
    const db = getDb();
    const result = await db.collection('Orders').updateOne(
        { _id: new ObjectId(orderId) },
        { $set: updateData }
    );
    return result;
}

async function deleteOrder(orderId) {
    const db = getDb();
    const result = await db.collection('Orders').deleteOne({ _id: new ObjectId(orderId) });
    return result.deletedCount;
>>>>>>> main
}

module.exports = {
    createOrder,
<<<<<<< HEAD
    updateOrderStatus,
    createOrderGuest
=======
    getOrderById,
    updateOrder,
    deleteOrder
>>>>>>> main
};
