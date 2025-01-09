const express = require('express');
const {
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
} = require('../controllers/clientController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Client routes
router.get('/', authenticateToken, authorizeRole('admin'), getAllClients);
router.get('/:id', authenticateToken, authorizeRole('client'), getClientById);
router.patch('/:id', authenticateToken, authorizeRole('client'), updateClient);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteClient);

module.exports = router;
