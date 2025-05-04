const express = require('express');
const router = express.Router();
const { handlePayPalWebhook, getPayPalClientId } = require('../controllers/paypalController');

// Get PayPal client ID
router.get('/config', getPayPalClientId);

// Handle PayPal webhook events
router.post('/webhook', handlePayPalWebhook);

module.exports = router;
