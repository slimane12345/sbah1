const express = require('express');
const router = express.Router();
const { getAllOrders, getStats, updateOrderStatus } = require('../controllers/adminController');

// In a real app, you'd protect these routes
// const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/admin/orders
// @desc    Admin gets all orders
// @access  Private/Admin
router.get('/orders', getAllOrders);

// @route   GET /api/admin/stats
// @desc    Admin gets dashboard stats
// @access  Private/Admin
router.get('/stats', getStats);

// @route   PUT /api/admin/orders/:id/status
// @desc    Admin updates order status
// @access  Private/Admin
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
