const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB Atlas Connected Successfully!');
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`🗃️  Database: ${conn.connection.name}`);
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('🔧 Troubleshooting:');
        console.log('1. Check your internet connection');
        console.log('2. Verify MongoDB Atlas IP whitelist (allow access from anywhere for testing)');
        console.log('3. Check MONGODB_URI in your .env file (username/password/database name)');
        process.exit(1);
    }
};

module.exports = connectDB;
