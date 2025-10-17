// Test script to verify MongoDB connection and delete operation
require('dotenv').config();
const mongoose = require('mongoose');

const testDeleteOperation = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI ? 'MONGODB_URI is set' : 'MONGODB_URI is NOT set');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected successfully');
    console.log('Database:', mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Collections in database:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Check if users collection exists
    const userCollectionExists = collections.some(col => col.name === 'users');
    console.log('\n👥 Users collection exists:', userCollectionExists);
    
    if (userCollectionExists) {
      // Count documents in users collection
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log('Total users in database:', userCount);
      
      // List first 5 users (without sensitive data)
      const users = await mongoose.connection.db.collection('users')
        .find({}, { projection: { name: 1, email: 1, provider: 1, createdAt: 1, deletedAt: 1 } })
        .limit(5)
        .toArray();
      
      console.log('\n📝 Sample users:');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - Provider: ${user.provider || 'local'} - Deleted: ${user.deletedAt ? 'Yes' : 'No'}`);
      });
    }
    
    // Test delete operation with a dummy user
    console.log('\n🧪 Testing delete operation...');
    const testUserId = new mongoose.Types.ObjectId();
    console.log('Test User ID:', testUserId);
    
    // Try to delete non-existent user
    const result = await mongoose.connection.db.collection('users').deleteOne({ _id: testUserId });
    console.log('Delete result for non-existent user:', result);
    console.log('  - acknowledged:', result.acknowledged);
    console.log('  - deletedCount:', result.deletedCount);
    
    if (result.acknowledged) {
      console.log('✅ Delete operation is working (MongoDB connection is functional)');
    } else {
      console.log('❌ Delete operation failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
};

testDeleteOperation();
