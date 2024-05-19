const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

async function createAccessory(name, description, prezzo,quantita) {
    const db = getDb();
    const accessoryData = { name, description, prezzo,quantita, createdAt: new Date() };
    const result = await db.collection('Accessories').insertOne(accessoryData);
    return result.insertedId;
}

async function getAllAccessories() {
    const db = getDb();
    return await db.collection('Accessories').find({}).toArray();
}

async function deleteAccessory(accessoryId) {
    const db = getDb();
    return await db.collection('Accessories').deleteOne({ _id: new ObjectId(accessoryId) });
}

module.exports = {
    createAccessory,
    getAllAccessories,
    deleteAccessory
};
