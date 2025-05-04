const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not defined');
      return false;
    }

    // Log the MongoDB URI (without sensitive credentials)
    const sanitizedUri = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:****@'
    );
    console.log(`Attempting to connect to MongoDB: ${sanitizedUri}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout for Vercel
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`Error details: ${JSON.stringify(error)}`);

    // Don't exit the process, allow the server to run without DB
    return false;
  }
};

// Export a function to check if MongoDB is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

module.exports = { connectDB, isConnected };
