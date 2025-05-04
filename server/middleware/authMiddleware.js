const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Try to verify token with current JWT_SECRET
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (verifyError) {
        console.log('Token verification failed with current secret, returning 401');
        // Instead of throwing an error, return a 401 response
        return res.status(401).json({
          message: 'Your session has expired. Please log in again.',
          tokenExpired: true
        });
      }

      // Get user from the token (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          message: 'User not found. Please log in again.',
          tokenExpired: true
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        message: 'Authentication failed. Please log in again.',
        tokenExpired: true
      });
    }
  } else if (!token) {
    return res.status(401).json({
      message: 'No authentication token found. Please log in.',
      tokenExpired: true
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };
