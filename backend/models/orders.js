const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');

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
}

module.exports = {
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder
};
