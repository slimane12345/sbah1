const Restaurant = require('../models/Restaurant');

// @desc    Get all active and approved restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isApproved: true, isActive: true })
            .populate('owner', 'fullName email');
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new restaurant (for owners)
// @route   POST /api/restaurants
// @access  Private (should be protected for 'restaurant_owner' userType)
exports.createRestaurant = async (req, res) => {
    // In a real app, ownerId would come from req.user after authentication middleware
    const { ownerId, name, description, cuisineType, address } = req.body;
    
    if (!ownerId || !name || !address) {
        return res.status(400).json({ message: 'Owner, name, and address are required' });
    }

    try {
        const restaurant = new Restaurant({
            owner: ownerId,
            name,
            description,
            cuisineType,
            address,
            // isApproved is false by default, pending admin review
        });
        
        const createdRestaurant = await restaurant.save();
        res.status(201).json(createdRestaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
