const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getActiveCoupons,
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);

// @route   POST /api/coupons/validate
// @desc    Validate coupon
router.post('/validate', validateCoupon);

// @route   GET /api/coupons/active
// @desc    Get active coupons for user
router.get('/active', getActiveCoupons);

// Admin routes
// @route   POST /api/coupons
// @desc    Create a new coupon
router.post('/', admin, createCoupon);

// @route   GET /api/coupons
// @desc    Get all coupons
router.get('/', admin, getCoupons);

// @route   GET /api/coupons/:id
// @desc    Get coupon by ID
router.get('/:id', admin, getCouponById);

// @route   PUT /api/coupons/:id
// @desc    Update coupon
router.put('/:id', admin, updateCoupon);

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon
router.delete('/:id', admin, deleteCoupon);

module.exports = router;
