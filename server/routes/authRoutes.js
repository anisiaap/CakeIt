const express = require('express');
const multer = require('multer');
const { register, login, logout, checkField, registerClient, uploads} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const {GridFsStorage} = require("multer-gridfs-storage");
require('dotenv').config();

const router = express.Router();

// Multer setup for file uploads
// MongoDB URI
const mongoURI = process.env.MONGO_URI;

//GridFS Storage setup
const storage = new GridFsStorage({
    url: mongoURI,
    file: async (req, file) => {
        try {
            console.log('Saving file to GridFS:', file.originalname);
            return {
                filename: `${Date.now()}-${file.originalname}`,
                bucketName: 'uploads',
            };
        } catch (err) {
            console.error('GridFsStorage error:', err.message);
            throw err;
        }
    },

});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log('File MIME type:', file.mimetype); // Debug log
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type.'));
        }
    },
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'fiscalDocuments', maxCount: 5 },
    { name: 'sanepidApproval', maxCount: 1 },
    { name: 'locationProof', maxCount: 1 },
]);


router.post('/register', (req, res, next) => {
    req.uploadedFileIds = []; // Initialize an array to store file IDs

    upload(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err.message);
            return res.status(500).json({ message: 'File upload failed', error: err.message });
        }

        // Extract file IDs and store them in req.uploadedFileIds
        if (req.files) {
            for (const [key, files] of Object.entries(req.files)) {
                files.forEach((file) => {
                    req.uploadedFileIds.push(file.id || file._id); // Add file IDs to the array
                });
            }
        }

        next(); // Proceed to the `register` controller
    });
}, register);
router.post('/registerClient', registerClient); // Add multer middleware here
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/check-field', checkField);
router.get('/uploads/:filename', uploads);

module.exports = router;
