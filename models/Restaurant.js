const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    addressText: { type: String, required: true },
    city: { type: String, required: true },
    neighborhood: String,
    latitude: Number,
    longitude: Number,
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Restaurant name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    logoUrl: String,
    coverPhotoUrl: String,
    cuisineType: String,
    deliveryTime: String, // e.g., "25-35 minutes"
    minimumOrder: {
        type: Number,
        default: 0,
    },
    deliveryFee: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isApproved: {
        type: Boolean,
        default: false, // Admin must approve
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
    address: addressSchema,
}, {
    timestamps: true,
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
