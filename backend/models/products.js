const { ObjectId } = require('mongodb');
const { db } = require('../config/database');

const collectionName = 'Products';

async function createProduct(productData) {
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(productData);
    return result.insertedId;
}

async function getProductById(productId) {
    const collection = db.collection(collectionName);
    const product = await collection.findOne({ _id: ObjectId(productId) });
    return product;
}

async function updateProduct(productId, updateData) {
    const collection = db.collection(collectionName);
    const result = await collection.updateOne({ _id: ObjectId(productId) }, { $set: updateData });
    return result.modifiedCount;
}

async function deleteProduct(productId) {
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ _id: ObjectId(productId) });
    return result.deletedCount;
}

async function listProducts() {
    const collection = db.collection(collectionName);
    const products = await collection.find({}).toArray();
    return products;
}

module.exports = {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    listProducts,
};
