
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import Routers
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- API Routes ---

// Health Check
app.get('/api/health', (req, res) => res.json({ status: '✅ Healthy', success: true }));

// Use API Routers
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);


// Catch-all for 404s to help debug
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => { // Listen on 0.0.0.0 to be accessible
    console.log(`
🎉 ==================================
🚀 SERVER STARTED!
✅ All API routes are now active.
📍 Listening on http://localhost:${PORT}
🎉 ==================================
    `);
});
