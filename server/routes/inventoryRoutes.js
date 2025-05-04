const express = require('express');
const router = express.Router();
const {
  updateInventory,
  getInventoryHistory,
  getAllInventoryHistory,
  getLowStockProducts,
  updateInventoryAfterDelivery,
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and require admin access
router.use(protect);
router.use(admin);

// @route   GET /api/inventory/history
// @desc    Get all inventory history
router.get('/history', getAllInventoryHistory);

// @route   GET /api/inventory/low-stock
// @desc    Get low stock products
router.get('/low-stock', getLowStockProducts);

// @route   PUT /api/inventory/order/:id/delivered
// @desc    Update inventory after order delivery
router.put('/order/:id/delivered', updateInventoryAfterDelivery);

// @route   PUT /api/inventory/:id
// @desc    Update product inventory
router.put('/:id', updateInventory);

// @route   GET /api/inventory/:id/history
// @desc    Get inventory history for a product
router.get('/:id/history', getInventoryHistory);

module.exports = router;
