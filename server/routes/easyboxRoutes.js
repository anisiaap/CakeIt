const express = require('express');
const {
    reserveEasybox,
    checkEasybox,
    updateEasybox,
    updateEasyboxbox,
    checkEasyboxStatus,
    // Import the new controller
} = require('../controllers/easyboxController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Easybox routes
router.post('/reserve', authenticateToken, authorizeRole('client'), reserveEasybox);
router.post('/reservations/check', authenticateToken, checkEasybox);
router.post('/reservations/status', checkEasyboxStatus); // New route for Flutter app
router.patch('/update', authenticateToken, updateEasybox);
router.patch('/update-box', updateEasyboxbox);
module.exports = router;
