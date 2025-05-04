const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const notificationPreferencesSchema = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    orderStatusUpdates: {
      type: Boolean,
      default: true,
    },
    deliveryUpdates: {
      type: Boolean,
      default: true,
    },
    promotionalMessages: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: function() {
        // Email is required only if mobile is not provided
        return !this.mobile;
      },
      unique: true,
      sparse: true, // Allows multiple null values (for users who only use mobile)
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: function() {
        // Mobile is required only if email is not provided
        return !this.email;
      },
      unique: true,
      sparse: true, // Allows multiple null values (for users who only use email)
    },
    password: {
      type: String,
      required: function() {
        // Password is not required for mobile-only users who use OTP
        return this.email !== undefined;
      },
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'blacklisted'],
      default: 'active',
    },
    statusReason: {
      type: String,
      default: '',
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    notificationPreferences: notificationPreferencesSchema,
  },
  {
    timestamps: true,
  }
);

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
