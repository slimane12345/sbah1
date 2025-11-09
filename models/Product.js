const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: String,
    category: {
        type: String,
        required: true,
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    preparationTime: Number, // in minutes
    calories: Number,
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
