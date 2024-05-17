const express = require('express');
const router = express.Router();
const { createProduct, createVariant, getVariantsByProductId, getAllProducts, deleteProduct, deleteVariant,decrementVariantQuantity } = require('../models/products');
const multer = require('multer');
const fs = require('fs'); 
const fsp = fs.promises;
const path = require('path'); 



//ritorna tutte le varianti per un id 
router.get('/:productId/variants', async (req, res) => {
    const { productId } = req.params;
    try {
        const variants = await getVariantsByProductId(productId);
        if (variants.length > 0) {
            res.status(200).json(variants);
        } else {
            res.status(404).json({ message: "Nessuna variante trovata per questo prodotto" });
        }
    } catch (error) {
        console.error("Errore nel recupero delle varianti:", error);
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



// Helper function to send the first image found in the specified directory
const sendFirstImage = async (res, dirPath) => {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error("Errore nell'accesso alla directory:", err);
            return res.status(500).json({ error: 'Errore interno del server' });
        }

        const imageFile = files.find(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        if (imageFile) {
            res.sendFile(path.join(dirPath, imageFile));
        } else {
            res.status(404).json({ error: 'Nessuna immagine trovata' });
        }
    });
};

// Endpoint per l'immagine frontale
router.get('/:idProd/:colore/frontale', (req, res) => {
    const { idProd, colore } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, colore, 'frontale');
    sendFirstImage(res, dirPath);
});

// Endpoint per l'immagine sinistra
router.get('/:idProd/:colore/sinistra', (req, res) => {
    const { idProd, colore } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, colore, 'sinistra');
    sendFirstImage(res, dirPath);
});

// Endpoint per l'immagine destra
router.get('/:idProd/:colore/destra', (req, res) => {
    const { idProd, colore } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, colore, 'destra');
    sendFirstImage(res, dirPath);
});

// Endpoint per l'immagine posteriore
router.get('/:idProd/:colore/posteriore', (req, res) => {
    const { idProd, colore } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, colore, 'posteriore');
    sendFirstImage(res, dirPath);
});



router.get('/:idProd/innovativa', (req, res) => {
    const { idProd } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, 'pic' , 'innovativa');
    sendFirstImage(res, dirPath);
});

// Endpoint per l'immagine sinistra
router.get('/:idProd/simpatica', (req, res) => {
    const { idProd } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, 'pic' , 'simpatica');
    sendFirstImage(res, dirPath);
});

// Endpoint per l'immagine principale
router.get('/:idProd/principale', (req, res) => {
    const { idProd } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, 'pic' , 'principale');
    sendFirstImage(res, dirPath);
});

// Endpoint per l'immagine secondatia
router.get('/:idProd/secondaria', (req, res) => {
    const { idProd } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'products', idProd, 'pic' , 'secondaria');
    sendFirstImage(res, dirPath);
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


router.delete('/:productId/:colore', async (req, res) => {
    const { productId, colore } = req.params;
    try {
        const result = await deleteVariant(productId, colore);

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        console.error("Errore nell'eliminazione della variante o delle immagini:", error);
        res.status(500).json({ error: "Errore interno del server" });
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
    const {nome, prezzo, descrizione,categoria,motto,caratteristiche } = req.body;
    try {
        const productId = await createProduct(nome, prezzo,descrizione,categoria,motto,caratteristiche);
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
        const { idProd, colore } = req.params;
        const subfolderMap = {
            'fileF': 'frontale',
            'fileS': 'sinistra',
            'fileD': 'destra',
            'fileB': 'posteriore'
        };
        const subFolder = subfolderMap[file.fieldname] || '';
        const folderPath = path.join(__dirname, '..', 'images', 'products', idProd, colore, subFolder);
        fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'fileF', maxCount: 1 },
    { name: 'fileS', maxCount: 1 },
    { name: 'fileD', maxCount: 1 },
    { name: 'fileB', maxCount: 1 }
]);

router.post('/upload/:idProd/:colore', upload, (req, res) => {
    if (req.files) {
        let response = Object.keys(req.files).map(key => ({
            fieldName: key,
            filePath: req.files[key][0].path
        }));
        res.status(201).json({ message: 'Files caricati con successo', files: response });
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




const storageP = multer.diskStorage({
    destination: function (req, file, cb) {
        const { idProd } = req.params;
        const subfolderMap = {
            'fileI': 'innovativa',
            'fileS': 'simpatica',
            'file1': 'principale',
            'file2': 'secondaria'
        };
        const subFolder = subfolderMap[file.fieldname] || '';
        const folderPath = path.join(__dirname, '..', 'images', 'products', idProd, 'pic', subFolder);
        fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadP = multer({ storage: storageP }).fields([
    { name: 'fileI', maxCount: 1 },
    { name: 'fileS', maxCount: 1 },
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 }
]);

router.post('/uploadPic/:idProd', uploadP, (req, res) => {
    if (req.files) {
        let response = Object.keys(req.files).map(key => ({
            fieldName: key,
            filePath: req.files[key][0].path
        }));
        res.status(201).json({ message: 'Files caricati con successo', files: response });
    } else {
        res.status(400).json({ error: 'Nessun file caricato' });
    }
});



module.exports = router;
