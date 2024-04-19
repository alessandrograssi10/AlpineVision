const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');
const fs = require('fs'); 
const fsp = fs.promises;
const path = require('path');

const productsCollectionName = 'Products';
const variantsCollectionName = 'Variants';

async function createProduct( nome, prezzo, descrizione) {
    try {
        const db = getDb();
        const productData = { nome, prezzo, descrizione };
        const result = await db.collection(productsCollectionName).insertOne(productData);

        // Crea la cartella principale del prodotto
        const productDirectory = path.join(__dirname, '..', 'images','products', result.insertedId.toString());
        await fsp.mkdir(productDirectory, { recursive: true });

        return result.insertedId;
    } catch (error) {
        console.error("Errore nella creazione del prodotto:", error);
        throw error;
    }
}

async function createVariant(productId, colore, quantita) {
    try {
        const db = getDb();
        const variantData = { productId: new ObjectId(productId), colore, quantita };
        const result = await db.collection(variantsCollectionName).insertOne(variantData);

        // Crea la sottocartella per la variante specifica del colore
        const baseDir = path.join(__dirname, '..','images','products', productId);
        console.log(baseDir);
        await fsp.mkdir(path.join(baseDir, colore), { recursive: true });

        return result.insertedId;
    } catch (error) {
        console.error("Errore nella creazione della variante del prodotto:", error);
        throw error;
    }
}


async function getVariantsByProductId(productId) {
    const db = getDb();
    return await db.collection('Variants').find({ productId: new ObjectId(productId) }).toArray();
}

async function getAllProducts() {
    const db = getDb();
    return await db.collection('Products').find({}).toArray();
}






async function deleteProduct(prodId) {
    try {
        const db = getDb();
        const prodCollection = db.collection('Products');
        // Usa 'new' per creare una nuova istanza di ObjectId
        const result = await prodCollection.deleteOne({ _id: new ObjectId(prodId) });
        return result;
    } catch (error) {
        console.error("Errore nell'eliminazione del post:", error);
        throw error;
    }
}



async function decrementVariantQuantity(productId, colore, decrement) {
    try {
        const db = getDb();
        const variantsCollection = db.collection('Variants');

        // Ottieni prima la variante per assicurarti che la quantità sia sufficiente
        const variant = await variantsCollection.findOne({ productId: new ObjectId(productId), colore: colore });

        if (!variant || variant.quantita < decrement) {
            throw new Error('Quantità insufficiente o variante non trovata.');
        }

        // Decrementa la quantità
        const result = await variantsCollection.updateOne(
            { productId: new ObjectId(productId), colore: colore },
            { $inc: { quantita: -decrement } }
        );

        return result;
    } catch (error) {
        console.error("Errore nella decrementazione della quantità della variante:", error);
        throw error;
    }
}






module.exports = {
    createProduct,
    createVariant,
    getVariantsByProductId,
    getAllProducts,
    deleteProduct,
    decrementVariantQuantity
};
