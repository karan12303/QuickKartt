require('dotenv').config();
const mongoose = require('mongoose');

const checkMongoDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    console.log('Connection successful!');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('MongoDB Connection Error:');
    console.error(`Error: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\nPossible solutions:');
      console.log('1. Make sure MongoDB is installed and running on your system');
      console.log('2. Check if the MongoDB URI in your .env file is correct');
      console.log('3. If using MongoDB Atlas, check your network connection and whitelist your IP');
    }
  }
};

checkMongoDB();
