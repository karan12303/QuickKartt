const express = require('express');
const router = express.Router();
const {
  getSalesAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
  getProductAnalytics,
  getDashboardSummary,
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and require admin access
router.use(protect);
router.use(admin);

// @route   GET /api/analytics/sales
// @desc    Get sales analytics
router.get('/sales', getSalesAnalytics);

// @route   GET /api/analytics/orders
// @desc    Get order analytics
router.get('/orders', getOrderAnalytics);

// @route   GET /api/analytics/users
// @desc    Get user analytics
router.get('/users', getUserAnalytics);

// @route   GET /api/analytics/products
// @desc    Get product analytics
router.get('/products', getProductAnalytics);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard summary
router.get('/dashboard', getDashboardSummary);

module.exports = router;
