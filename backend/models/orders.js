const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');

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
}

module.exports = {
    createOrder,
    updateOrderStatus
};
