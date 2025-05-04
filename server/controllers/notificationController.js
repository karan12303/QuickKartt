const User = require('../models/userModel');
const Order = require('../models/orderModel');

// @desc    Save user notification preferences
// @route   POST /api/notifications/preferences
// @access  Private
const saveNotificationPreferences = async (req, res) => {
  try {
    const { phone, enabled, orderStatusUpdates, deliveryUpdates, promotionalMessages } = req.body;
    
    // Update user with notification preferences
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create or update notification preferences
    user.notificationPreferences = {
      phone,
      enabled,
      orderStatusUpdates,
      deliveryUpdates,
      promotionalMessages
    };
    
    await user.save();
    
    res.status(200).json({
      message: 'Notification preferences saved successfully',
      preferences: user.notificationPreferences
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Send SMS notification for order status change
// @route   POST /api/notifications/order-status
// @access  Private/Admin
const sendOrderStatusNotification = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    // Find the order
    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user has notification preferences and has enabled them
    if (!order.user.notificationPreferences || !order.user.notificationPreferences.enabled) {
      return res.status(200).json({ message: 'User has not enabled notifications' });
    }
    
    // Check if user wants order status updates
    if (!order.user.notificationPreferences.orderStatusUpdates) {
      return res.status(200).json({ message: 'User has not enabled order status notifications' });
    }
    
    // Get user phone number
    const phone = order.user.notificationPreferences.phone;
    
    if (!phone) {
      return res.status(400).json({ message: 'User has no phone number for notifications' });
    }
    
    // Prepare message based on status
    let message = '';
    switch (status) {
      case 'processing':
        message = `Your order #${order.orderId} is now being processed. We'll update you when it ships.`;
        break;
      case 'shipped':
        message = `Great news! Your order #${order.orderId} has been shipped and is on its way to you.`;
        break;
      case 'delivered':
        message = `Your order #${order.orderId} has been delivered. Thank you for shopping with QuickKart!`;
        break;
      default:
        message = `Your order #${order.orderId} status has been updated to: ${status}`;
    }
    
    // In a real implementation, you would integrate with an SMS service here
    // For example, using Twilio:
    /*
    const twilio = require('twilio');
    const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */
    
    // For now, we'll just simulate sending an SMS
    console.log(`SMS notification would be sent to ${phone}: ${message}`);
    
    res.status(200).json({
      message: 'SMS notification sent successfully',
      details: {
        recipient: phone,
        content: message
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Send delivery notification
// @route   POST /api/notifications/delivery
// @access  Private/Admin
const sendDeliveryNotification = async (req, res) => {
  try {
    const { orderId, estimatedDelivery } = req.body;
    
    // Find the order
    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user has notification preferences and has enabled them
    if (!order.user.notificationPreferences || !order.user.notificationPreferences.enabled) {
      return res.status(200).json({ message: 'User has not enabled notifications' });
    }
    
    // Check if user wants delivery updates
    if (!order.user.notificationPreferences.deliveryUpdates) {
      return res.status(200).json({ message: 'User has not enabled delivery notifications' });
    }
    
    // Get user phone number
    const phone = order.user.notificationPreferences.phone;
    
    if (!phone) {
      return res.status(400).json({ message: 'User has no phone number for notifications' });
    }
    
    // Prepare delivery message
    const message = `Your QuickKart order #${order.orderId} is out for delivery and should arrive by ${estimatedDelivery}. Thank you for your patience!`;
    
    // In a real implementation, you would integrate with an SMS service here
    // Simulating SMS sending for now
    console.log(`SMS notification would be sent to ${phone}: ${message}`);
    
    res.status(200).json({
      message: 'Delivery notification sent successfully',
      details: {
        recipient: phone,
        content: message
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  saveNotificationPreferences,
  sendOrderStatusNotification,
  sendDeliveryNotification
};
