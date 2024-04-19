const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');

const collectionName = 'Products';

async function createProduct(codice, nome, prezzo, categoria,descrizione, colore = null) {
    try {
        const db = getDb();
        const productsCollection = db.collection('Products');
        const productData = { codice, nome, prezzo,descrizione };
        if (categoria !== null) {
            productData.categoria = categoria;
        }
        if (colore !== null) {
            productData.colore = colore;
        }
        const result = await productsCollection.insertOne(productData);
        return result.insertedId;
    } catch (error) {
        console.error("Errore nella creazione del prodotto:", error);
        throw error;
    }
}





async function deleteProduct(productId) {
    try {
        const db = getDb();
        const productsCollection = db.collection(collectionName);  // Assicurati che 'collectionName' sia 'Products'
        // Usa 'new' per creare una nuova istanza di ObjectId
        const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
        return result;
    } catch (error) {
        console.error("Errore nell'eliminazione del prodotto:", error);
        throw error;
    }
}

async function updateProductPrice(productId, newPrice) {
    try {
        const db = getDb();
        const productsCollection = db.collection(collectionName);
        const result = await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: { prezzo: newPrice } }
        );
        return result;
    } catch (error) {
        console.error("Errore nell'aggiornamento del prezzo del prodotto:", error);
        throw error;
    }
}

async function updateProductDescription(productId, newDescription) {
    try {
        const db = getDb();
        const productsCollection = db.collection(collectionName);
        const result = await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: { descrizione: newDescription } }
        );
        return result;
    } catch (error) {
        console.error("Errore nell'aggiornamento della descrizione del prodotto:", error);
        throw error;
    }
}


module.exports = {
    createProduct,
    deleteProduct,
    updateProductPrice,
    updateProductDescription
};
