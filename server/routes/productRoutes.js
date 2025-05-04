const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { isConnected } = require('../config/db');
const {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
// @route   GET /api/products
// @desc    Fetch all products
router.get('/', getProducts);

// @route   GET /api/products/search
// @desc    Search products
router.get('/search', searchProducts);

// @route   GET /api/products/diagnostics
// @desc    Diagnostic endpoint to check MongoDB connection
router.get('/diagnostics', async (req, res) => {
  try {
    // Environment check
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      mongodbUriExists: !!process.env.MONGODB_URI,
      mongodbUriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'not set',
      vercelEnv: process.env.VERCEL_ENV || 'not set',
      vercelRegion: process.env.VERCEL_REGION || 'not set'
    };

    // Connection check
    const connectionInfo = {
      isConnected: isConnected(),
      connectionState: mongoose.connection.readyState,
      connectionStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    };

    // Try a simple query
    let queryResult = 'not attempted';
    let error = null;

    if (connectionInfo.isConnected) {
      try {
        // Try to get a count of products
        const Product = mongoose.model('Product');
        const count = await Product.countDocuments();
        queryResult = `Success: Found ${count} products`;
      } catch (err) {
        queryResult = 'Failed';
        error = {
          message: err.message,
          stack: err.stack,
          name: err.name
        };
      }
    }

    res.json({
      timestamp: new Date().toISOString(),
      environment: envInfo,
      connection: connectionInfo,
      query: {
        result: queryResult,
        error: error
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Diagnostics failed',
      error: error.message,
      stack: error.stack
    });
  }
});

// @route   GET /api/products/:id
// @desc    Fetch single product
router.get('/:id', getProductById);

// @route   POST /api/products/seed
// @desc    Seed sample products
router.post('/seed', seedProducts);

// @route   GET /api/products/diagnostics
// @desc    Diagnostic endpoint to check MongoDB connection
router.get('/diagnostics', async (req, res) => {
  try {
    // Environment check
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      mongodbUriExists: !!process.env.MONGODB_URI,
      mongodbUriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'not set',
      vercelEnv: process.env.VERCEL_ENV || 'not set',
      vercelRegion: process.env.VERCEL_REGION || 'not set'
    };

    // Connection check
    const connectionInfo = {
      isConnected: isConnected(),
      connectionState: mongoose.connection.readyState,
      connectionStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    };

    // Try a simple query
    let queryResult = 'not attempted';
    let error = null;

    if (connectionInfo.isConnected) {
      try {
        // Try to get a count of products
        const Product = mongoose.model('Product');
        const count = await Product.countDocuments();
        queryResult = `Success: Found ${count} products`;
      } catch (err) {
        queryResult = 'Failed';
        error = {
          message: err.message,
          stack: err.stack,
          name: err.name
        };
      }
    }

    res.json({
      timestamp: new Date().toISOString(),
      environment: envInfo,
      connection: connectionInfo,
      query: {
        result: queryResult,
        error: error
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Diagnostics failed',
      error: error.message,
      stack: error.stack
    });
  }
});

// Admin routes
// @route   POST /api/products
// @desc    Create a new product
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', protect, admin, deleteProduct);



module.exports = router;
