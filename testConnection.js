// testConnection.js
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    console.log('🧪 Testing MongoDB Atlas Connection...\n');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🔗 Cluster: ${mongoose.connection.host}`);
        console.log(`👤 User: ${mongoose.connection.user}`);
        
        // اختبار إنشاء مجموعة
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📁 Collections: ${collections.length}`);
        
        await mongoose.connection.close();
        console.log('\n🎉 Connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ FAILED: Connection test failed!');
        console.error('Error:', error.message);
        process.exit(1);
    }
};

testConnection();
