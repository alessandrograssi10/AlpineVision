const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');

async function createOrder(userId, items) {
    const db = getDb();
    const order = {
        userId: new ObjectId(userId),
        items: items,
        status: 'received', 
        createdAt: new Date(),
        shippedAt: null,
        deliveredAt: null
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
