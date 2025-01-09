const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');

// Route for registration with file upload
router.post('/register', upload.single('image'), register);

router.get('/uploads/:filename', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Stream the file back to the client
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (err) {
        console.error('Error retrieving file:', err.message);
        res.status(500).json({ message: 'Error retrieving file' });
    }
});

module.exports = router;
