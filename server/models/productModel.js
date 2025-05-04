const mongoose = require('mongoose');

// Schema for footwear sizes
const footwearSizeSchema = mongoose.Schema(
  {
    ukSize: {
      type: String,
      required: true,
    },
    usSize: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  { _id: false }
);

// Schema for smartphone specifications
const smartphoneSpecSchema = mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    storage: {
      type: String,
      required: true,
    },
    ram: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  { _id: false }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    additionalImages: [
      {
        type: String,
      }
    ],
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    // Variations based on product category
    footwearSizes: [footwearSizeSchema],
    smartphoneSpecs: [smartphoneSpecSchema],
    // Flag to indicate if the product has variations
    hasVariations: {
      type: Boolean,
      default: false,
    },
    // Low stock threshold for notifications
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



const Product = mongoose.model('Product', productSchema);

module.exports = Product;
