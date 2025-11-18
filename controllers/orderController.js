const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (for authenticated customers)
exports.createOrder = async (req, res) => {
    // In a real app, customerId should come from an auth middleware, e.g., req.user.id
    const { customerId, restaurantId, items, deliveryAddress, paymentMethod, customerNotes, deliveryFee } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No order items provided' });
    }
    if (!customerId || !restaurantId || !deliveryAddress || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required order information' });
    }

    try {
        // Calculate prices and validate products from the database to prevent price tampering
        let totalAmount = 0;
        const orderItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found.`);
            }
            const itemTotalPrice = product.price * item.quantity;
            totalAmount += itemTotalPrice;
            return {
                product: item.product,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice: itemTotalPrice,
            };
        }));
        
        const finalAmount = totalAmount + (deliveryFee || 0);

        const order = new Order({
            orderNumber: `SBH-${Date.now()}`,
            customer: customerId,
            restaurant: restaurantId,
            items: orderItems,
            totalAmount,
            deliveryFee: deliveryFee || 0,
            finalAmount,
            deliveryAddress,
            paymentMethod,
            customerNotes,
            paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid', // Simple logic
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('❌ Error creating order:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get orders for the logged-in user
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    // In a real app, customerId would come from req.user.id
    const { customerId } = req.query; 
    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required to fetch orders.' });
    }

    try {
        const orders = await Order.find({ customer: customerId })
            .populate('restaurant', 'name logoUrl')
            .populate('items.product', 'name imageUrl')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('❌ Error fetching user orders:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { createOrder, getMyOrders };
