const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');
const fs = require('fs'); 
const fsp = fs.promises;
const path = require('path');

const productsCollectionName = 'Products';
const variantsCollectionName = 'Variants';

async function createProduct(nome, prezzo, descrizione, categoria, motto, caratteristiche) {
    const db = getDb();
    const productData = { nome, prezzo, descrizione,categoria, motto,caratteristiche };
    const result = await db.collection(productsCollectionName).insertOne(productData);

    const productDirectory = path.join(__dirname, '..', 'images', 'products', result.insertedId.toString());
    await fsp.mkdir(productDirectory, { recursive: true });
    await fsp.mkdir(path.join(productDirectory, 'pic'), { recursive: true });
    const picProdDir=path.join(__dirname, '..', 'images', 'products', result.insertedId.toString(),'pic');
    const subfolders = ['principale', 'secondaria', 'innovativa', 'simpatica'];
    for (let folder of subfolders) {
        await fsp.mkdir(path.join(picProdDir, folder), { recursive: true });
    }

    return result.insertedId;
}

async function createVariant(productId, colore, quantita) {
    const db = getDb();
    const variantData = { productId: new ObjectId(productId), colore, quantita };
    const result = await db.collection(variantsCollectionName).insertOne(variantData);

    const variantBaseDir = path.join(__dirname, '..', 'images', 'products', productId.toString(), colore);
    await fsp.mkdir(variantBaseDir, { recursive: true });
    const subfolders = ['frontale', 'sinistra', 'destra', 'posteriore'];
    for (let folder of subfolders) {
        await fsp.mkdir(path.join(variantBaseDir, folder), { recursive: true });
    }

    return result.insertedId;
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

// Funzione per eliminare una variante di prodotto e la sua cartella di immagini
async function deleteVariant(productId, colore) {
    const db = getDb();
    const variantsCollection = db.collection('Variants');
    const result = await variantsCollection.deleteOne({
        productId: new ObjectId(productId),
        colore: colore
    });

    if (result.deletedCount === 0) {
        return { success: false, message: "Variante non trovata" };
    }

    // Elimina la cartella delle immagini
    const dirPath = path.join(__dirname, '..', 'images', 'products', productId, colore);
    await fsp.rm(dirPath, { recursive: true, force: true });

    return { success: true, message: "Variante e immagini eliminate con successo" };
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
    decrementVariantQuantity,
    deleteVariant
};