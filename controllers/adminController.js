const Order = require('../models/Order');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// @desc    Admin gets all orders
// @route   GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('customer', 'fullName email avatarUrl')
            .populate('restaurant', 'name')
            .populate('driver', 'fullName avatarUrl')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// @desc    Admin gets dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ userType: 'customer' });
        const totalCouriers = await User.countDocuments({ userType: 'driver' });
        
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } }, 
            { $group: { _id: null, totalRevenue: { $sum: "$finalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue,
                totalUsers,
                totalCouriers,
            }
        });
    } catch (error) {
         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Admin updates order status
// @route   PUT /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusMap = {
            'جديد': 'pending',
            'مؤكد': 'confirmed',
            'قيد التجهيز': 'preparing',
            'جاهز': 'ready',
            'بالتوصيل': 'picked_up',
            'مكتمل': 'delivered',
            'ملغي': 'cancelled'
        };
        
        const backendStatus = statusMap[status];
        if (!backendStatus) {
            return res.status(400).json({ success: false, message: 'Invalid status value provided.' });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status: backendStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while updating status',
            error: error.message
        });
    }
};
