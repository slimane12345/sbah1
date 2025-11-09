const Product = require('../models/Product');
const Restaurant = require('../models/Restaurant');

// @desc    Get all products, possibly filtered by restaurant
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find(req.query)
            .populate('restaurant', 'name'); // Populate restaurant name
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    const { name, description, price, imageUrl, category, restaurant, isAvailable } = req.body;

    if (!name || !price || !category || !restaurant) {
        return res.status(400).json({ message: 'Name, price, category, and restaurant are required' });
    }

    try {
        const product = new Product({
            name,
            description,
            price,
            imageUrl,
            category,
            restaurant, // This should be the ObjectId of the restaurant
            isAvailable,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    const { name, description, price, imageUrl, category, isAvailable } = req.body;
    
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.imageUrl = imageUrl || product.imageUrl;
        product.category = category || product.category;
        product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne(); // Use deleteOne() for Mongoose v6+
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
