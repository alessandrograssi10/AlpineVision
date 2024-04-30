const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');


async function createPost(data) {
    const db = getDb();
    const post = {
        position: data.position, // Position in the blog
        date: new Date(), // Current date
        title: data.title,
        description: data.description,
        content: {
            part1: data.art_p1,
            part2: {
                title: data.art_p2_title,
                body: data.art_p2
            },
            part3: {
                title: data.art_p3_title,
                body: data.art_p3
            }
        },
        author: data.author
    };

    const result = await db.collection('Posts').insertOne(post);
    const postId = result.insertedId.toString();
    await ensureDirectories(postId);
    return postId;
}

async function ensureDirectories(postId) {
    const baseDir = path.join(__dirname, '..','images','posts', postId); // Change from 'images' to 'backend'
    await fs.mkdir(path.join(baseDir, 'contenuto'), { recursive: true });
    await fs.mkdir(path.join(baseDir, 'copertina'), { recursive: true });
}

async function editPost(postId, data) {
    const db = getDb();
    const updateData = {
        position: data.position,
        title: data.title,
        description: data.description,
        content: {
            part1: data.art_p1,
            part2: {
                title: data.art_p2_title,
                body: data.art_p2
            },
            part3: {
                title: data.art_p3_title,
                body: data.art_p3
            }
        },
        author: data.author,
        date: data.date // Assuming you might want to update the date as well
    };

    const result = await db.collection('Posts').updateOne(
        { _id: new ObjectId(postId) },
        { $set: updateData }
    );
    return result;
}


async function getAllPosts() {
    const db = getDb();
    return await db.collection('Posts').find({}).toArray();
}
async function deletePost(postId) {
    try {
        const db = getDb();
        const postsCollection = db.collection('Posts');
        // Usa 'new' per creare una nuova istanza di ObjectId
        const result = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
        return result;
    } catch (error) {
        console.error("Errore nell'eliminazione del post:", error);
        throw error;
    }
}








module.exports = {
    createPost,
    getAllPosts,
    editPost,
    deletePost
};
