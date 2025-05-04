const mongoose = require('mongoose');

const orderImageSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['delivery', 'product', 'receipt', 'other'],
      default: 'product',
    },
  },
  {
    timestamps: true,
  }
);

const OrderImage = mongoose.model('OrderImage', orderImageSchema);

module.exports = OrderImage;
