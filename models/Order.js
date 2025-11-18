const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    unitPrice: { // price at the time of order
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    specialInstructions: String,
}, { _id: false });


const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // A user with userType 'driver'
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
        default: 'pending',
    },
    totalAmount: { // sum of item prices
        type: Number,
        required: true,
    },
    deliveryFee: {
        type: Number,
        default: 0,
    },
    finalAmount: { // totalAmount + deliveryFee
        type: Number,
        required: true,
    },
    deliveryAddress: { // Embedded for historical record
        addressText: String,
        city: String,
        latitude: Number,
        longitude: Number,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'wallet'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    customerNotes: String,

}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
