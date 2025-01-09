const express = require('express');
const {
    getAllBakeries,
    getBakeryById,
    updateBakery,
    deleteBakery,
    approveBakery,
} = require('../controllers/bakeryController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Bakery routes
router.get('/', getAllBakeries);
router.get('/:id', getBakeryById);
router.put('/:id', authenticateToken, authorizeRole('bakery'), updateBakery);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteBakery);
router.put('/:id/approve', authenticateToken, authorizeRole('admin'), approveBakery);

module.exports = router;
