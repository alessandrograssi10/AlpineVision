const { ObjectId } = require('mongodb');
const { db } = require('../config/database');

const collectionName = 'Orders';

async function createOrder(orderData) {
    // Imposta la data di ordine a oggi + 3 giorni
    orderData.data = new Date();
    orderData.data.setDate(orderData.data.getDate() + 3);

    const collection = db.collection(collectionName);
    const result = await collection.insertOne(orderData);
    return result.insertedId;
}

async function getOrderById(orderId) {
    const collection = db.collection(collectionName);
    const order = await collection.findOne({ _id: ObjectId(orderId) });
    return order;
}

async function updateOrder(orderId, updateData) {
    const collection = db.collection(collectionName);
    const result = await collection.updateOne({ _id: ObjectId(orderId) }, { $set: updateData });
    return result.modifiedCount;
}

async function deleteOrder(orderId) {
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ _id: ObjectId(orderId) });
    return result.deletedCount;
}

async function listOrders() {
    const collection = db.collection(collectionName);
    const orders = await collection.find({}).toArray();
    return orders;
}

module.exports = {
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
    listOrders,
};
