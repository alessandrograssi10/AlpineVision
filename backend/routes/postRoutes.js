const express = require('express');
const router = express.Router();
const {createPost } = require('../models/post');
const { getDb } = require('../config/database');

router.post('/', async (req, res) => {
    const { title, image, description, art_p1, art_p2, art_p3_title, art_p3, author, date } = req.body;
    try {
        const postId = await createPost(title, image, description, art_p1, art_p2, art_p3_title, art_p3, author, date);
        res.status(201).json({ message: "Post creato con successo", postId: postId });
    } catch (error) {
        console.error("Errore nella creazione del post:", error);
        res.status(500).json({ error: "Errore nel server durante la creazione del post" });
    }
});

router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const postsCollection = db.collection('Posts');
        const posts = await postsCollection.find({}).toArray(); // Recupera tutti i post
        res.status(200).json(posts);
    } catch (error) {
        console.error("Errore nel recupero dei post:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


module.exports = router;
