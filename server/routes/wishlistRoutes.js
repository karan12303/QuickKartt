const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// @route   POST /api/wishlist
// @desc    Add product to wishlist
router.post('/', addToWishlist);

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
router.delete('/:productId', removeFromWishlist);

// @route   GET /api/wishlist
// @desc    Get user's wishlist
router.get('/', getWishlist);

// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
router.get('/check/:productId', checkWishlist);

module.exports = router;
