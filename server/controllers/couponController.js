const Coupon = require('../models/couponModel');
const Product = require('../models/productModel');

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit,
      applicableCategories,
      applicableProducts,
      firstTimeOnly,
      applicableUsers,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Create new coupon
    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscountAmount: maxDiscountAmount || null,
      startDate,
      endDate,
      usageLimit: usageLimit || null,
      applicableCategories: applicableCategories || [],
      applicableProducts: applicableProducts || [],
      firstTimeOnly: firstTimeOnly || false,
      applicableUsers: applicableUsers || [],
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })
      .populate('applicableProducts', 'name imageUrl')
      .populate('applicableUsers', 'name email');

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('applicableProducts', 'name imageUrl')
      .populate('applicableUsers', 'name email')
      .populate('usedBy.user', 'name email')
      .populate('usedBy.orderId', 'orderId totalPrice');

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      isActive,
      startDate,
      endDate,
      usageLimit,
      applicableCategories,
      applicableProducts,
      firstTimeOnly,
      applicableUsers,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if updated code already exists (if code is being changed)
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      coupon.code = code.toUpperCase();
    }

    // Update coupon fields
    coupon.description = description || coupon.description;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue || coupon.discountValue;
    coupon.minOrderAmount = minOrderAmount !== undefined ? minOrderAmount : coupon.minOrderAmount;
    coupon.maxDiscountAmount = maxDiscountAmount !== undefined ? maxDiscountAmount : coupon.maxDiscountAmount;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
    coupon.startDate = startDate || coupon.startDate;
    coupon.endDate = endDate || coupon.endDate;
    coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
    coupon.firstTimeOnly = firstTimeOnly !== undefined ? firstTimeOnly : coupon.firstTimeOnly;

    // Update arrays if provided
    if (applicableCategories) coupon.applicableCategories = applicableCategories;
    if (applicableProducts) coupon.applicableProducts = applicableProducts;
    if (applicableUsers) coupon.applicableUsers = applicableUsers;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await Coupon.deleteOne({ _id: coupon._id });
    res.json({ message: 'Coupon removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount, products } = req.body;
    const userId = req.user._id;

    // Find coupon by code
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Get product details if product IDs are provided
    let productDetails = [];
    if (products && products.length > 0) {
      productDetails = await Product.find({ _id: { $in: products } });
    }

    // Validate coupon
    const validationResult = coupon.isValid(req.user, orderAmount, productDetails);

    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message });
    }

    // Calculate discount
    const discountAmount = coupon.calculateDiscount(orderAmount);

    res.json({
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get active coupons for user
// @route   GET /api/coupons/active
// @access  Private
const getActiveCoupons = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Find active coupons
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { usageLimit: null },
        { usageLimit: { $gt: '$usageCount' } },
      ],
    }).select('code description discountType discountValue minOrderAmount maxDiscountAmount startDate endDate');

    // Filter out coupons that are first-time only and already used by this user
    const filteredCoupons = coupons.filter(coupon => {
      if (coupon.firstTimeOnly) {
        return !coupon.usedBy.some(usage => usage.user.toString() === userId.toString());
      }
      return true;
    });

    res.json(filteredCoupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getActiveCoupons,
};
