const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        imageUrl: { type: String, default: 'https://via.placeholder.com/150' }, // Make imageUrl optional with a default value
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        // Variation details
        footwearSize: {
          ukSize: { type: String },
          usSize: { type: String }
        },
        smartphoneSpec: {
          model: { type: String },
          storage: { type: String },
          ram: { type: String }
        },
        // Flag to indicate if this item has variations
        hasVariations: { type: Boolean, default: false },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      pinCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    coupon: {
      code: { type: String },
      discountAmount: { type: Number, default: 0 },
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'upi', 'card', 'cod'],
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
