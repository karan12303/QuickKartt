const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Generate a unique order ID
const generateOrderId = () => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${randomNum}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      coupon,
    } = req.body;

    // Debug request body
    console.log('Order request body:', req.body);

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Validate shipping address fields
    const requiredAddressFields = ['fullName', 'addressLine', 'city', 'pinCode', 'phone'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({
          message: `Shipping address is missing required field: ${field}`,
          receivedAddress: shippingAddress
        });
      }
    }

    // Validate payment method
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Check if payment method is valid
    const validPaymentMethods = ['paypal', 'upi', 'card', 'cod'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: `Invalid payment method: ${paymentMethod}. Valid options are: ${validPaymentMethods.join(', ')}`,
        receivedPaymentMethod: paymentMethod
      });
    }

    try {
      // Create order with generated order ID
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: itemsPrice || totalPrice, // Fallback for backward compatibility
        shippingPrice: shippingPrice || 0,
        taxPrice: taxPrice || 0,
        totalPrice,
        orderId: generateOrderId(),
        isPaid: paymentMethod === 'cod' ? false : false, // Set to true for testing other payment methods if needed
      });

      // Add coupon information if provided
      if (coupon && coupon.code) {
        order.coupon = {
          code: coupon.code,
          discountAmount: coupon.discountAmount || 0,
          couponId: coupon.couponId,
        };

        // Update coupon usage if couponId is provided
        if (coupon.couponId) {
          const Coupon = require('../models/couponModel');
          await Coupon.findByIdAndUpdate(
            coupon.couponId,
            {
              $inc: { usageCount: 1 },
              $push: {
                usedBy: {
                  user: req.user._id,
                  orderId: order._id,
                },
              },
            }
          );
        }
      }

      console.log('Creating order:', order);
      const createdOrder = await order.save();
      console.log('Order created successfully:', createdOrder);
      res.status(201).json(createdOrder);
    } catch (saveError) {
      console.error('Error saving order:', saveError);
      return res.status(500).json({
        message: 'Error saving order',
        error: saveError.message,
        stack: process.env.NODE_ENV === 'production' ? null : saveError.stack
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (order) {
      // Check if the order belongs to the logged in user or if user is admin
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to view this order');
      }

      // Process order items to ensure product IDs are properly formatted
      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems = order.orderItems.map(item => {
          // If product is populated as an object, extract just the ID
          if (item.product && typeof item.product === 'object' && item.product._id) {
            // Create a new object with the product ID as a string
            return {
              ...item.toObject(),
              productId: item.product._id.toString() // Add a new field with just the ID
            };
          }
          return item;
        });
      }

      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400);
      throw new Error('Status is required');
    }

    const order = await Order.findById(req.params.id)
      .populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order is being marked as delivered
    const isBeingDelivered = status === 'delivered' && order.status !== 'delivered';

    console.log(`Order ${order._id} status update: ${order.status} -> ${status}`);
    console.log(`Is being marked as delivered: ${isBeingDelivered}`);

    // Update the order status
    order.status = status;

    // If the order is being marked as delivered, update product quantities
    if (isBeingDelivered) {
      console.log(`Processing stock updates for order ${order._id} with ${order.orderItems.length} items`);

      try {
        // Process each order item to update product quantities
        for (const item of order.orderItems) {
          console.log(`Processing order item: ${JSON.stringify(item)}`);

          // Skip if product reference is missing
          if (!item.product || !item.product._id) {
            console.warn(`Product reference missing for item: ${item._id}`);
            continue;
          }

          const productId = item.product._id;
          const orderedQuantity = item.qty;

          console.log(`Updating stock for product ID: ${productId}, quantity: ${orderedQuantity}`);

          // Find the product and update its stock
          const product = await Product.findById(productId);

          if (product) {
            const currentStock = product.countInStock;
            // Calculate new stock level
            const newStockLevel = Math.max(0, currentStock - orderedQuantity);

            console.log(`Stock update calculation: ${currentStock} - ${orderedQuantity} = ${newStockLevel}`);

            // Update the product stock
            product.countInStock = newStockLevel;
            const updatedProduct = await product.save();

            console.log(`✅ Stock updated for product "${product.name}" (${productId}): ${currentStock} -> ${updatedProduct.countInStock}`);
          } else {
            console.warn(`❌ Product not found for ID: ${productId}`);
          }
        }

        console.log(`✅ All stock updates completed for order ${order._id}`);
      } catch (stockUpdateError) {
        console.error('❌ Error updating product stock:', stockUpdateError);
        // We'll continue with the order update even if stock update fails
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update order payment status
// @route   PUT /api/orders/:id/pay or /api/orders/:id/user-pay
// @access  Private/Admin or Private (for user's own orders)
const updateOrderPayment = async (req, res) => {
  try {
    const { isPaid, paymentResult } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
      // Check if the user is authorized to update this order
      // Allow if user is admin OR if the order belongs to the user
      const isAdmin = req.user.role === 'admin';
      const isOwner = order.user.toString() === req.user._id.toString();

      if (!isAdmin && !isOwner) {
        return res.status(401).json({ message: 'Not authorized to update this order' });
      }
      order.isPaid = isPaid;

      if (isPaid) {
        order.paidAt = Date.now();

        // If payment result is provided, update it
        if (paymentResult) {
          // Check if this is a user or admin making the update
          const isAdminUpdate = req.user.role === 'admin';

          // Create payment result object with additional details
          order.paymentResult = {
            id: paymentResult.id || (isAdminUpdate ? 'admin-update' : 'user-payment'),
            status: paymentResult.status || 'COMPLETED',
            update_time: paymentResult.update_time || new Date().toISOString(),
            email_address: paymentResult.email_address || req.user.email,
            // Store payment method if provided
            paymentMethod: paymentResult.paymentMethod || order.paymentMethod,
            // Store any notes
            notes: paymentResult.notes || '',
            // Flag to indicate if this was an admin update
            adminUpdate: isAdminUpdate
          };

          console.log(`Payment completed for order ${order._id} via ${order.paymentResult.paymentMethod || 'unknown method'}`);
        } else {
          // Default payment result for admin updates
          order.paymentResult = {
            id: `admin-update-${Date.now()}`,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: req.user.email,
            adminUpdate: true
          };
        }
      } else {
        // If marking as unpaid, remove payment details
        order.paidAt = undefined;
        order.paymentResult = undefined;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPayment
};
