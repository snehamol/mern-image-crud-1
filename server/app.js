import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import 'dotenv/config'
import { dirname, join } from 'path';
import { unlink } from 'fs';
import { fileURLToPath } from 'url';


const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mern');



const __dirname = dirname(fileURLToPath(import.meta.url));

// Define a MongoDB schema and model for images
const imageSchema = new mongoose.Schema({
    title: String,
    description: String,
    imagePath: String,
});

const Image = mongoose.model('Image', imageSchema);

// Set up Multer for image uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

app.use(cors());
app.use(express.json());
const upload = multer({ storage });

// app.use('/uploads', express.static( 'uploads'));
app.use('/uploads', express.static(join(__dirname, 'uploads')));
// 

// API routes for CRUD operations
// Create an image
app.post('/api/images', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;

        // return true
        const imagePath = req.file.path;
        const image = new Image({ title, description, imagePath });
        await image.save();
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ error: 'Could not upload the image.' });
    }
});

// Read all images
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve images.' });
    }
});

// Read a single image by ID
app.get('/api/images/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found.' });
        }
        res.json(image);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve the image.' });
    }
});

// Update an image by ID
app.put('/api/images/:id', upload.single('image'), async (req, res) => {
    try {

        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        unlink(image.imagePath, function (err) {
            if (err) throw err;
            console.log('File is deleted!');
        });


        await Image.findByIdAndUpdate(req.params.id, { $set: { imagePath: req.file.path } })

        res.json(image);
    } catch (error) {
        res.status(500).json({ error: 'Could not update the image.' });
    }
});

// Delete an image by ID
app.delete('/api/images/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        const deletedImage = await Image.findByIdAndRemove(req.params.id);

        if (!deletedImage) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        unlink(image.imagePath, function (err) {
            if (err) throw err;
            console.log('File is deleted!');
        });

        res.json(deletedImage);
    } catch (error) {
        res.status(500).json({ error: 'Could not delete the image.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
