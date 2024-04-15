const express = require('express');
const router = express.Router();
const { createPost, getAllPosts } = require('../models/post'); // Aggiorna il percorso se necessario
const path = require('path');
const fs = require('fs');

// Route per creare un post
router.post('/createPost', async (req, res) => {
    try {
        const postId = await createPost(req.body);
        res.status(201).json({ message: "Post creato con successo", postId });
    } catch (error) {
        console.error("Errore nella creazione del post:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

// Route per ottenere tutti i post
router.get('/getAllPosts', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error("Errore nel recupero dei post:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});

router.get('/photo-contenuto', (req, res) => {
    const {title} = req.query;
    // Costruisci il percorso dell'immagine
    const imagePath = path.join(__dirname,'..', 'images', 'posts',`${title}`, `contenuto.jpeg`);
    // Controlla se l'immagine esiste
    if (fs.existsSync(imagePath)) {
        // Se l'immagine esiste, inviala come risposta
        res.sendFile(imagePath);
    } else {
        // Se l'immagine non esiste, restituisci un errore 404
        res.status(404).json({ error: 'Immagine non trovata' });
    }
});
router.get('/photo-copertina', (req, res) => {
    const {title} = req.query;
    // Costruisci il percorso dell'immagine
    const imagePath = path.join(__dirname,'..', 'images', 'posts',`${title}`, `copertina.jpeg`);
    // Controlla se l'immagine esiste
    if (fs.existsSync(imagePath)) {
        // Se l'immagine esiste, inviala come risposta
        res.sendFile(imagePath);
    } else {
        // Se l'immagine non esiste, restituisci un errore 404
        res.status(404).json({ error: 'Immagine non trovata' });
    }
});



module.exports = router;
