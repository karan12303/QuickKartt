const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getLowStockProducts,
  notifyAdminsOfLowStock,
  setProductThreshold,
  restockProduct,
} = require('../controllers/inventoryNotificationController');

// Get low stock products
router.get('/low-stock', protect, admin, getLowStockProducts);

// Notify admins of low stock
router.post('/notify-admins', protect, admin, notifyAdminsOfLowStock);

// Set product threshold
router.put('/:id/threshold', protect, admin, setProductThreshold);

// Restock a product
router.put('/:id/restock', protect, admin, restockProduct);

module.exports = router;
