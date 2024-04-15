const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');


async function createUser(username, password) {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const result = await usersCollection.insertOne({ username, password });
        return result;
    } catch (error) {
        console.error("Errore nella creazione dell'utente:", error);
        throw error;
    }
}

async function deleteUser(userId) {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const result = await usersCollection.deleteOne({ _id: ObjectId(userId) });
        return result;
    } catch (error) {
        console.error("Errore nell'eliminazione dell'utente:", error);
        throw error;
    }
}

async function updateUserPassword(userId, newPassword) {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const result = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: { password: newPassword } });
        return result;
    } catch (error) {
        console.error("Errore nell'aggiornamento della password dell'utente:", error);
        throw error;
    }
}
//TODO
//aggiungere indirizzo
//modificare indirizzo


module.exports = {
    createUser,
    deleteUser,
    updateUserPassword
};
