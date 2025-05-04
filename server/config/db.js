const mongoose = require('mongoose');

// Hardcoded MongoDB URI for Vercel environment as a fallback
const FALLBACK_MONGODB_URI = 'mongodb+srv://karan:karan123@karan.xjte3l1.mongodb.net/ecommerce-cart?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment or use fallback
    const mongoURI = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;

    if (!mongoURI) {
      console.error('MONGODB_URI environment variable is not defined and fallback is not available');
      return false;
    }

    // Log the MongoDB URI (without sensitive credentials)
    const sanitizedUri = mongoURI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:****@'
    );
    console.log(`Attempting to connect to MongoDB: ${sanitizedUri}`);

    // Set mongoose options
    mongoose.set('strictQuery', false);

    // Connect with retry logic
    let retries = 3;
    let conn;

    while (retries > 0) {
      try {
        conn = await mongoose.connect(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 15000, // Increased timeout for Vercel
          connectTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          retryWrites: true,
          w: 'majority'
        });

        break; // If successful, exit the retry loop
      } catch (err) {
        retries--;
        console.error(`MongoDB connection attempt failed. Retries left: ${retries}`);
        console.error(`Error: ${err.message}`);

        if (retries === 0) throw err; // Re-throw if all retries failed

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`Error details: ${JSON.stringify(error, null, 2)}`);

    // Don't exit the process, allow the server to run without DB
    return false;
  }
};

// Export a function to check if MongoDB is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

module.exports = { connectDB, isConnected };
