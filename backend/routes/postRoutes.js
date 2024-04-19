const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, editPost , deletePost} = require('../models/post'); // Aggiorna il percorso se necessario
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // Import fs for callback-based operations
const fsp = fs.promises;

/*

GET

*/


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

//endpoint per foto conenuto
router.get('/photo-contenuto', (req, res) => {
    const {id} = req.query;
    const dirPath = path.join(__dirname, '..', 'images', 'posts', id, 'contenuto');

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error("Errore nell'accedere alla directory:", err);
            return res.status(500).json({ error: 'Errore interno del server' });
        }

        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        if (images.length === 0) {
            return res.status(404).json({ error: 'Immagini non trovate' });
        }

        res.sendFile(path.join(dirPath, images[0])); // Invia solo la prima immagine
    });
});

// Endpoint per recuperare immagini dalla copertina del post
router.get('/photo-copertina', (req, res) => {
    const {id} = req.query;
    const dirPath = path.join(__dirname, '..', 'images', 'posts', id, 'copertina');

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error("Errore nell'accedere alla directory:", err);
            return res.status(500).json({ error: 'Errore interno del server' });
        }

        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        if (images.length === 0) {
            return res.status(404).json({ error: 'Immagini non trovate' });
        }

        res.sendFile(path.join(dirPath, images[0])); // Invia solo la prima immagine
    });
});


/*

POST

*/




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

//Route per editare un Post
router.post('/editPost/:id', async (req, res) => {
    try {
        const result = await editPost(req.params.id, req.body);
        res.status(200).json({ message: "Post modificato con successo", result });
    } catch (error) {
        console.error("Errore nella modifica del post:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});







/*


Funzioni


*/

// Assicurati che la directory esista o creala
const ensureDirectoryExists = (folderPath) => {
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Funzione per determinare il tipo basato sulla rotta
const determineTypeFromRoute = (path) => {
    return path.includes('copertina') ? 'copertina' : 'contenuto';
};

// Configura Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { id } = req.params;
        const type = determineTypeFromRoute(req.originalUrl); // Determina 'copertina' o 'contenuto' basato sulla rotta
        const folderPath = path.join(__dirname, '..', 'images', 'posts', id, type);
        
        ensureDirectoryExists(folderPath);
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

/*

POST
IMMAGINI


*/

// Endpoint per caricare un'immagine nella cartella 'copertina'
router.post('/upload/copertina/:id', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(201).json({ message: 'File caricato con successo in copertina', filePath: req.file.path });
    } else {
        res.status(400).json({ error: 'Nessun file caricato' });
    }
});

// Endpoint per caricare un'immagine nella cartella 'contenuto'
router.post('/upload/contenuto/:id', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(201).json({ message: 'File caricato con successo in contenuto', filePath: req.file.path });
    } else {
        res.status(400).json({ error: 'Nessun file caricato' });
    }
});


/*

Funzioni

*/


const clearDirectory = async (dirPath) => {
    try {
        const files = await fsp.readdir(dirPath);
        const unlinkPromises = files.map(file => fsp.unlink(path.join(dirPath, file)));
        return Promise.all(unlinkPromises);
    } catch (err) {
        console.error("Errore durante la pulizia della directory:", err);
    }
};


// Middleware per pulire la directory prima di caricare un nuovo file
async function clearDirMiddleware(req, res, next) {
    const { id } = req.params;
    const type = determineTypeFromRoute(req.originalUrl);
    const dirPath = path.join(__dirname, '..', 'images', 'posts', id, type);

    try {
        await clearDirectory(dirPath);
        console.log("Directory cleared");
        next(); // Prosegui con l'upload del file
    } catch (error) {
        console.error("Errore nella pulizia della directory:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
}



/*

AGGIORNARE FOTO

*/


// Endpoint per aggiornare un'immagine nella cartella 'copertina'
router.post('/update/copertina/:id', clearDirMiddleware, upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(201).json({ message: 'Immagine copertina aggiornata con successo', filePath: req.file.path });
    } else {
        res.status(400).json({ error: 'Nessun file caricato' });
    }
});

// Endpoint per aggiornare un'immagine nella cartella 'contenuto'
router.post('/update/contenuto/:id', clearDirMiddleware, upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(201).json({ message: 'Immagine contenuto aggiornata con successo', filePath: req.file.path });
    } else {
        res.status(400).json({ error: 'Nessun file caricato' });
    }
});




/*

DELETE

*/



// Route per eliminare un post 
router.delete('/:postId', async (req, res) => {
    console.log(req.params.postId);
    const postId = req.params.postId;
    try {
        const result = await deletePost(postId);
        if (result.deletedCount === 1) {
            const directoryPath = path.join(__dirname, '..', 'images', 'posts', postId);
            // Elimina la cartella e tutto il suo contenuto
            console.log(directoryPath);
            await fsp.rm(directoryPath, { recursive: true });
            res.status(200).json({ message: "Post eliminato con successo" });
        } else {
            res.status(404).json({ error: "Post non trovato" });
        }
    } catch (error) {
        console.error("Errore nell'eliminazione del post:", error);
        res.status(500).json({ error: "Errore nell'eliminazione del post" });
    }
});




module.exports = router;
