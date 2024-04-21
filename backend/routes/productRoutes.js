const express = require('express');
const router = express.Router();
const { createProduct, createVariant, getVariantsByProductId, getAllProducts, deleteProduct, decrementVariantQuantity } = require('../models/products');
const multer = require('multer');
const fs = require('fs'); 
const fsp = fs.promises;
const path = require('path'); 



//ritorna tutte le varianti per un id 
router.get('/:productId/variants', async (req, res) => {
    const { productId } = req.params;
    try {
        console.log("Richiesta per le varianti del prodotto con ID:", productId); // Log della richiesta
        const variants = await getVariantsByProductId(productId);
        console.log("Varianti trovate:", variants); // Log delle varianti trovate
        if (variants.length > 0) {
            res.status(200).json(variants);
        } else {
            console.log("Nessuna variante trovata per questo prodotto"); // Log nel caso nessuna variante venga trovata
            res.status(404).json({ message: "Nessuna variante trovata per questo prodotto" });
        }
    } catch (error) {
        console.error("Errore nel recupero delle varianti:", error); // Log degli errori
        res.status(500).json({ error: "Errore interno del server" });
    }
});


//ritorna tutti i prodotti
router.get('/', async (req, res) => { //funziona
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Errore nel recupero dei prodotti:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});


router.get('/photo-variante', (req, res) => {
    const {idProd, colore} = req.query;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, colore);

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


// Elimina prodotto e tutte le sue varianti
router.delete('/:prodId', async (req, res) => {
    console.log(req.params.prod);
    const prodId = req.params.prodId;
    try {
        const result = await deleteProduct(prodId);
        if (result.deletedCount === 1) {
            const directoryPath = path.join(__dirname, '..', 'images', 'products', prodId);
            // Elimina la cartella e tutto il suo contenuto
            console.log(directoryPath);
            await fsp.rm(directoryPath, { recursive: true });
            res.status(200).json({ message: "Prodotto eliminato con successo" });
        } else {
            res.status(404).json({ error: "Prodotto non trovato" });
        }
    } catch (error) {
        console.error("Errore nell'eliminazione del prodotto:", error);
        res.status(500).json({ error: "Errore nell'eliminazione del prodotto" });
    }
});





// Decrementa la quantità di una variante di prodotto
router.patch('/:productId/:colore/decrement', async (req, res) => {
    const { productId, colore } = req.params;
    const { decrement } = req.body;  // Assumiamo che il decremento venga inviato nel corpo della richiesta

    if (decrement <= 0) {
        return res.status(400).json({ error: "Il valore di decremento deve essere maggiore di zero" });
    }

    try {
        const result = await decrementVariantQuantity(productId, colore, decrement);
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Quantità decrementata con successo" });
        } else {
            res.status(404).json({ error: "Prodotto o variante non trovata, o quantità non sufficiente" });
        }
    } catch (error) {
        console.error("Errore nella gestione della richiesta:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
});





// Crea prodotto
router.post('/', async (req, res) => { //funziona
    const {nome, prezzo, descrizione } = req.body;
    try {
        const productId = await createProduct(nome, prezzo, descrizione);
        res.status(201).json({ _id: productId });
    } catch (error) {
        console.error("Errore nella creazione del prodotto:", error);
        res.status(500).json({ error: "Errore nella creazione del prodotto" });
    }
});

// Crea variante per prodotto
router.post('/:productId/variants', async (req, res) => { //funziona
    const { colore, quantita } = req.body;
    const { productId } = req.params;
    try {
        const variantId = await createVariant(productId, colore, quantita);
        res.status(201).json({ _id: variantId });
    } catch (error) {
        console.error("Errore nella creazione della variante:", error);
        res.status(500).json({ error: "Errore nella creazione della variante" });
    }
});








// Configura Multer per il caricamento dei file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { idProd, colore } = req.params;  // Correggi l'accesso ai parametri
        const folderPath = path.join(__dirname, '..', 'images', 'products', idProd, colore);
        ensureDirectoryExists(folderPath);
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Endpoint per caricare un'immagine per una variante specifica del prodotto
router.post('/upload/:idProd/:colore', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(201).json({ message: 'File caricato con successo', filePath: req.file.path });
    } else {
        res.status(400).json({ error: 'Nessun file caricato' });
    }
});

// Assicurati che la directory esista o creala
const ensureDirectoryExists = folderPath => {
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath, { recursive: true });
    }
};




module.exports = router;
