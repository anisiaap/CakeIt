const express = require('express');
const {
  createOrder,
  getOrdersByClient,
  updateOrderStatus,
  cancelOrderByClient,
  getAllOrders,
  getOrdersByBakery,
  getOrderById, // Import the new controller
} = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Order routes
router.get('/bakery', authenticateToken, authorizeRole('bakery'), getOrdersByBakery); // Get orders for a bakery
router.post('/', authenticateToken, authorizeRole('client'), createOrder); // Create a new order
router.get('/client', authenticateToken, authorizeRole('client'), getOrdersByClient); // Get orders for a client
router.get('/admin', authenticateToken, authorizeRole('admin'), getAllOrders); // Get all orders for admin
router.get('/:id', authenticateToken, getOrderById); // Fetch specific order details by ID
router.patch('/:id/status', authenticateToken, updateOrderStatus); // Update order status (accessible for multiple roles based on middleware logic)
router.patch('/:id/cancel', authenticateToken, authorizeRole('client'), cancelOrderByClient); // Cancel an order by client

module.exports = router;
