const mongoose = require('mongoose');

const inventoryHistorySchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      enum: ['add', 'remove', 'adjust', 'order', 'delivery'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
    // For variation-specific inventory changes
    variation: {
      type: {
        type: String,
        enum: ['footwear', 'smartphone', 'none'],
        default: 'none',
      },
      footwearSize: {
        ukSize: { type: String },
        usSize: { type: String },
      },
      smartphoneSpec: {
        model: { type: String },
        storage: { type: String },
        ram: { type: String },
      },
    },
    // Reference to order if inventory change is related to an order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  {
    timestamps: true,
  }
);

const InventoryHistory = mongoose.model('InventoryHistory', inventoryHistorySchema);

module.exports = InventoryHistory;
