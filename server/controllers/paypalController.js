const path = require('path');
const dotenv = require('dotenv');

// Load environment variables directly in this controller to ensure they're available
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// @desc    Process PayPal webhook events (for future use)
// @route   POST /api/paypal/webhook
// @access  Public
const handlePayPalWebhook = async (req, res) => {
  try {
    console.log('Received PayPal webhook event');

    // Note: This webhook handler is a placeholder for future implementation
    // For a complete webhook implementation, you would need:
    // 1. A publicly accessible HTTPS endpoint
    // 2. Registration of the webhook URL in the PayPal Developer Dashboard
    // 3. Proper verification of webhook signatures

    // Log the event type for debugging
    const event = req.body;
    console.log(`PayPal webhook event type: ${event?.event_type || 'unknown'}`);

    // For debugging purposes, log the custom_id which contains our order ID
    if (event?.resource?.custom_id) {
      console.log(`Order ID from custom_id: ${event.resource.custom_id}`);
    } else if (event?.resource?.purchase_units &&
               event.resource.purchase_units[0] &&
               event.resource.purchase_units[0].custom_id) {
      console.log(`Order ID from purchase_units custom_id: ${event.resource.purchase_units[0].custom_id}`);
    }

    // Currently, payment status is updated directly from the client-side
    // after successful payment completion via the PayPal button

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({
      received: true,
      message: 'Webhook received, but processing is handled client-side for now'
    });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get PayPal client ID from environment variables
// @route   GET /api/paypal/config
// @access  Public
const getPayPalClientId = (_, res) => {
  console.log('PayPal Client ID from env:', process.env.PAYPAL_CLIENT_ID);

  if (!process.env.PAYPAL_CLIENT_ID) {
    console.error('PayPal Client ID is not defined in environment variables');
    return res.status(500).json({
      error: 'PayPal configuration is missing',
      envVars: Object.keys(process.env).filter(key => key.includes('PAYPAL'))
    });
  }

  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
};

module.exports = {
  handlePayPalWebhook,
  getPayPalClientId,
};
