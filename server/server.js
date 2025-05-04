const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB, isConnected } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Load Twilio environment variables
try {
  const fs = require('fs');
  const twilioEnvPath = path.resolve(__dirname, '.env.twilio');

  if (fs.existsSync(twilioEnvPath)) {
    const twilioEnv = require('dotenv').parse(fs.readFileSync(twilioEnvPath));

    // Set Twilio environment variables
    process.env.TWILIO_ACCOUNT_SID = twilioEnv.TWILIO_ACCOUNT_SID;
    process.env.TWILIO_AUTH_TOKEN = twilioEnv.TWILIO_AUTH_TOKEN;
    process.env.TWILIO_PHONE_NUMBER = twilioEnv.TWILIO_PHONE_NUMBER;

    console.log('Twilio environment variables loaded successfully');
  } else {
    console.log('Twilio environment file not found');
  }
} catch (error) {
  console.error('Error loading Twilio environment variables:', error);
}

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  console.log('Server will continue to run without database connection');
});

// Middleware
app.use(express.json()); // Parse JSON bodies

// Configure CORS with specific options
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.1.9:3000', 'http://192.168.1.9:3001', 'https://quick-kartt-w98g-awfgyw8lt-karan12303s-projects.vercel.app', 'https://quick-kartt.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/orders', require('./routes/orderImageRoutes')); // Order image routes
app.use('/api/users/addresses', require('./routes/addressRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/inventory-notifications', require('./routes/inventoryNotificationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/paypal', require('./routes/paypalRoutes'));
app.use('/api/banner', require('./routes/bannerRoutes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;
