const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    // Limit coupon to specific categories
    applicableCategories: [
      {
        type: String,
      },
    ],
    // Limit coupon to specific products
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    // Users who have used this coupon
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
        },
      },
    ],
    // Limit coupon to first-time users only
    firstTimeOnly: {
      type: Boolean,
      default: false,
    },
    // Limit coupon to specific users
    applicableUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to check if coupon is valid
couponSchema.methods.isValid = function (user, orderAmount, products) {
  const now = new Date();

  // Check if coupon is active
  if (!this.isActive) {
    return { valid: false, message: 'Coupon is not active' };
  }

  // Check if coupon is expired
  if (now > this.endDate) {
    return { valid: false, message: 'Coupon has expired' };
  }

  // Check if coupon is not yet valid
  if (now < this.startDate) {
    return { valid: false, message: 'Coupon is not yet valid' };
  }

  // Check if coupon has reached usage limit
  if (this.usageLimit !== null && this.usageCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }

  // Check if order amount meets minimum requirement
  if (orderAmount < this.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${this.minOrderAmount} required`,
    };
  }

  // Check if user has already used this coupon (if first time only)
  if (this.firstTimeOnly && user) {
    const userHasUsed = this.usedBy.some(
      (usage) => usage.user.toString() === user._id.toString()
    );
    if (userHasUsed) {
      return { valid: false, message: 'Coupon can only be used once per user' };
    }
  }

  // Check if coupon is applicable to specific users
  if (
    this.applicableUsers.length > 0 &&
    user &&
    !this.applicableUsers.some(
      (userId) => userId.toString() === user._id.toString()
    )
  ) {
    return { valid: false, message: 'Coupon is not applicable for this user' };
  }

  // Check if products match applicable products or categories
  if (
    (this.applicableProducts.length > 0 || this.applicableCategories.length > 0) &&
    products &&
    products.length > 0
  ) {
    const hasApplicableProduct = products.some((product) => {
      // Check if product is in applicable products
      if (
        this.applicableProducts.length > 0 &&
        this.applicableProducts.some(
          (id) => id.toString() === product._id.toString()
        )
      ) {
        return true;
      }

      // Check if product category is in applicable categories
      if (
        this.applicableCategories.length > 0 &&
        this.applicableCategories.includes(product.category)
      ) {
        return true;
      }

      return false;
    });

    if (!hasApplicableProduct) {
      return {
        valid: false,
        message: 'Coupon is not applicable for these products',
      };
    }
  }

  return { valid: true, message: 'Coupon is valid' };
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function (orderAmount) {
  let discountAmount = 0;

  if (this.discountType === 'percentage') {
    discountAmount = (orderAmount * this.discountValue) / 100;
    // Apply max discount limit if set
    if (this.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, this.maxDiscountAmount);
    }
  } else if (this.discountType === 'fixed') {
    discountAmount = this.discountValue;
  }

  // Ensure discount doesn't exceed order amount
  discountAmount = Math.min(discountAmount, orderAmount);

  return discountAmount;
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
