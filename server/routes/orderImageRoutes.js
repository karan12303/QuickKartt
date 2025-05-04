const express = require('express');
const router = express.Router();
const {
  uploadOrderImage,
  getOrderImages,
  deleteOrderImage,
} = require('../controllers/orderImageController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// @route   POST /api/orders/:id/images
// @desc    Upload order image
router.post('/:id/images', uploadOrderImage);

// @route   GET /api/orders/:id/images
// @desc    Get order images
router.get('/:id/images', getOrderImages);

// @route   DELETE /api/orders/:id/images/:imageId
// @desc    Delete order image
router.delete('/:id/images/:imageId', deleteOrderImage);

module.exports = router;
