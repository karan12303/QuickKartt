const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPayment
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', createOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
router.get('/myorders', getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
router.get('/:id', getOrderById);

// Admin routes
// @route   GET /api/orders
// @desc    Get all orders
router.get('/', admin, getOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
router.put('/:id/status', admin, updateOrderStatus);

// @route   PUT /api/orders/:id/pay
// @desc    Update order payment status (admin only)
router.put('/:id/pay', admin, updateOrderPayment);

// @route   PUT /api/orders/:id/user-pay
// @desc    Update order payment status (for users making payments)
router.put('/:id/user-pay', updateOrderPayment);

module.exports = router;
