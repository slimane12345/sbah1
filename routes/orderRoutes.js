const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');

// In a real app, you would add authentication middleware like this:
// const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (for authenticated users)
router.post('/', /* protect, */ createOrder);

// @route   GET /api/orders/myorders
// @desc    Get orders for the logged-in user
// @access  Private
router.get('/myorders', /* protect, */ getMyOrders);

module.exports = router;
