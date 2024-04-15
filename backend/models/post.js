const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');

const collectionName = 'Posts';


async function createPost(title, image, description, art_p1, art_p2, art_p3_title, art_p3, author, date) {
    try {
        const db = getDb();
        const postsCollection = db.collection(collectionName);
        const postData = {
            title: title,
            image: image,
            description: description,
            content: {
                part1: art_p1,
                part2: art_p2,
                part3: {
                    title: art_p3_title,
                    body: art_p3
                }
            },
            author: author,
            date: date
        };
        const result = await postsCollection.insertOne(postData);
        return result.insertedId;
    } catch (error) {
        console.error("Errore nella creazione del post:", error);
        throw error;
    }
}

module.exports = {
    createPost
};
