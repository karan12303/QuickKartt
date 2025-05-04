const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  saveNotificationPreferences,
  sendOrderStatusNotification,
  sendDeliveryNotification
} = require('../controllers/notificationController');

// User routes
router.post('/preferences', protect, saveNotificationPreferences);

// Admin routes
router.post('/order-status', protect, admin, sendOrderStatusNotification);
router.post('/delivery', protect, admin, sendDeliveryNotification);

module.exports = router;
