const express = require('express');
const router = express.Router();
const {
  getBannerSettings,
  getAllBannerSettings,
  addProductToBanner,
  updateBannerSetting,
  removeProductFromBanner,
  reorderBannerProducts,
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
// @route   GET /api/banner
// @desc    Get active banner settings
router.get('/', getBannerSettings);

// Admin routes
// @route   GET /api/banner/admin
// @desc    Get all banner settings (including inactive)
router.get('/admin', protect, admin, getAllBannerSettings);

// @route   POST /api/banner
// @desc    Add product to banner
router.post('/', protect, admin, addProductToBanner);

// @route   PUT /api/banner/:id
// @desc    Update banner setting
router.put('/:id', protect, admin, updateBannerSetting);

// @route   DELETE /api/banner/:id
// @desc    Remove product from banner
router.delete('/:id', protect, admin, removeProductFromBanner);

// @route   PUT /api/banner/reorder
// @desc    Reorder banner products
router.put('/reorder', protect, admin, reorderBannerProducts);

module.exports = router;
