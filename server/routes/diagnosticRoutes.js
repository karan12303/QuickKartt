const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { isConnected } = require('../config/db');

// @route   GET /api/diagnostics
// @desc    Diagnostic endpoint to check system status
router.get('/', async (req, res) => {
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

// @route   GET /api/diagnostics/mongodb
// @desc    Test MongoDB connection
router.get('/mongodb', async (req, res) => {
  try {
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({
        success: false,
        message: 'MongoDB URI is not set in environment variables'
      });
    }
    
    // Check connection state
    const connectionState = mongoose.connection.readyState;
    const connectionStateText = ['disconnected', 'connected', 'connecting', 'disconnecting'][connectionState] || 'unknown';
    
    if (connectionState !== 1) {
      return res.status(500).json({
        success: false,
        message: `MongoDB is not connected. Current state: ${connectionStateText} (${connectionState})`,
        uri: process.env.MONGODB_URI.substring(0, 20) + '...'
      });
    }
    
    // Try a simple query
    const Product = mongoose.model('Product');
    const count = await Product.countDocuments();
    
    return res.json({
      success: true,
      message: `MongoDB is connected. Found ${count} products.`,
      state: connectionStateText
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error testing MongoDB connection',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

module.exports = router;
