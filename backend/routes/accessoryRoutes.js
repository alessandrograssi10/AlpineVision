const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { createAccessory, getAllAccessories, deleteAccessory } = require('../models/accessory');

router.post('/', async (req, res) => {
    const { name, description, prezzo,quantita } = req.body;

    if (isNaN(prezzo)) {
        return res.status(400).json({ error: "Invalid price format" });
    }

    try {
        const accessoryId = await createAccessory(name, description, prezzo, quantita);
        const baseDir = path.join(__dirname, '..', 'images', 'accessories', accessoryId.toString());
        fs.mkdirSync(baseDir, { recursive: true });
        fs.mkdirSync(path.join(baseDir, 'image1'), { recursive: true });
        fs.mkdirSync(path.join(baseDir, 'image2'), { recursive: true });
        fs.mkdirSync(path.join(baseDir, 'image3'), { recursive: true });

        res.status(201).json({ message: "Accessory created successfully", accessoryId });
    } catch (error) {
        console.error("Error creating accessory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { accessoryId } = req.params;
        const subfolderMap = {
            'image1': 'image1',
            'image2': 'image2',
            'image3': 'image3'
        };
        const subFolder = subfolderMap[file.fieldname];
        const folderPath = path.join(__dirname, '..', 'images', 'accessories', accessoryId, subFolder);
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep original file name
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]);

router.post('/upload/:accessoryId', upload, (req, res) => {
    if (req.files) {
        let response = Object.keys(req.files).map(key => ({
            fieldName: key,
            filePath: req.files[key][0].path
        }));
        res.status(201).json({ message: 'Images uploaded successfully', files: response });
    } else {
        res.status(400).json({ error: 'No files uploaded' });
    }
});



// GET route to fetch all accessories
router.get('/', async (req, res) => {
    try {
        const accessories = await getAllAccessories();
        res.status(200).json(accessories);
    } catch (error) {
        console.error("Error retrieving accessories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE route to remove an accessory
router.delete('/:accessoryId', async (req, res) => {
    const { accessoryId } = req.params;
    try {
        const result = await deleteAccessory(accessoryId);
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Accessory deleted successfully" });
        } else {
            res.status(404).json({ error: "Accessory not found" });
        }
    } catch (error) {
        console.error("Error deleting accessory:", error);
        res.status(500).json({ error: "Internal server error" });
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

// Endpoint per recuperare l'immagine da image1
router.get('/:accessoryId/image1', (req, res) => {
    const { accessoryId } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'accessories', accessoryId, 'image1');
    sendFirstImage(res, dirPath);
});

// Endpoint per recuperare l'immagine da image2
router.get('/:accessoryId/image2', (req, res) => {
    const { accessoryId } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'accessories', accessoryId, 'image2');
    sendFirstImage(res, dirPath);
});

// Endpoint per recuperare l'immagine da image3
router.get('/:accessoryId/image3', (req, res) => {
    const { accessoryId } = req.params;
    const dirPath = path.join(__dirname, '..', 'images', 'accessories', accessoryId, 'image3');
    sendFirstImage(res, dirPath);
});


module.exports = router;
