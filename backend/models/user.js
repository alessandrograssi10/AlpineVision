const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');


async function createUser(username,email, password) {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const result = await usersCollection.insertOne({username, email, password });
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
        // Usa 'new' per creare una nuova istanza di ObjectId
        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
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
        const result = await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { password: newPassword } });
        return result;
    } catch (error) {
        console.error("Errore nell'aggiornamento della password dell'utente:", error);
        throw error;
    }
}
async function setPhone(userId, newPhone) {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { numeroDiTelefono: newPhone } }
        );
        return result;
    } catch (error) {
        console.error("Errore nell'impostazione del numero di telefono dell'utente:", error);
        throw error;
    }
}
async function setAddress(userId, newAddress) {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { indirizzo: newAddress } }
        );
        return result;
    } catch (error) {
        console.error("Errore nell'aggiornamento dell'indirizzo dell'utente:", error);
        throw error;
    }
}

async function findUserByEmail(email) {
    try {
        const db = getDb();
        const usersCollection = db.collection('Users');
        const user = await usersCollection.findOne({ email: email });
        return user;
    } catch (error) {
        console.error("Errore nel recupero dell'utente per il login:", error);
        throw error;
    }
}


module.exports = {
    createUser,
    deleteUser,
    updateUserPassword,
    setAddress,
    setPhone,
    findUserByEmail
};
