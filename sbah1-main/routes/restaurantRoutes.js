const express = require('express');
const router = express.Router();
const { getAllRestaurants, getRestaurantById, createRestaurant } = require('../controllers/restaurantController');

// @route   GET /api/restaurants
// @desc    Get all active and approved restaurants
// @access  Public
router.get('/', getAllRestaurants);

// @route   GET /api/restaurants/:id
// @desc    Get a single restaurant by its ID
// @access  Public
router.get('/:id', getRestaurantById);

// @route   POST /api/restaurants
// @desc    Create a new restaurant application
// @access  Private (should be protected for restaurant_owner type)
router.post('/', createRestaurant);

module.exports = router;
