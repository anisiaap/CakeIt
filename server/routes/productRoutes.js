const express = require('express');
const multer = require('multer');
const {
    addProduct,
    getAllProducts,
    getProductsByBakery,
    updateProduct,
    deleteProduct,
    updateStock,
    getStock
} = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });
// Product routes
router.post('/', authenticateToken, authorizeRole('bakery'), upload.single('image'), addProduct);
router.get('/', authenticateToken, authorizeRole('bakery'), getAllProducts);
router.get('/bakery', authenticateToken, authorizeRole('bakery'), getProductsByBakery);
router.patch('/:id/stock', authenticateToken, authorizeRole('bakery'), updateStock);
router.put('/:id', authenticateToken, authorizeRole('bakery'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('bakery'), deleteProduct);
router.post('/check-stock',  authenticateToken, authorizeRole('client'), getStock);

module.exports = router;
