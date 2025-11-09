const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin/RestaurantOwner)
router.post('/', createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin/RestaurantOwner)
router.put('/:id', updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin/RestaurantOwner)
router.delete('/:id', deleteProduct);

module.exports = router;
