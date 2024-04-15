const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');


async function createPost(data) {
    const db = getDb();
    const post = {
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
        date: data.date
    };

    const result = await db.collection('Posts').insertOne(post);
    const postId = result.insertedId.toString();
    await ensureDirectories(postId);
    return postId;
}

async function ensureDirectories(postId) {
    const baseDir = path.join(__dirname, '..', 'images', 'post', postId);
    await fs.mkdir(path.join(baseDir, 'content'), { recursive: true });
    await fs.mkdir(path.join(baseDir, 'copertina'), { recursive: true });
}

async function getAllPosts() {
    const db = getDb();
    return await db.collection('Posts').find({}).toArray();
}

module.exports = {
    createPost,
    getAllPosts
};
