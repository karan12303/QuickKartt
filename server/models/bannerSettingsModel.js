const mongoose = require('mongoose');

const bannerSettingsSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  {
    timestamps: true,
  }
);

const BannerSettings = mongoose.model('BannerSettings', bannerSettingsSchema);

module.exports = BannerSettings;
