const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is already in wishlist
    const user = await User.findById(userId);
    const isProductInWishlist = user.wishlist.some(
      (item) => item.toString() === productId
    );

    if (isProductInWishlist) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add product to wishlist
    await User.findByIdAndUpdate(
      userId,
      { $push: { wishlist: productId } },
      { new: true }
    );

    res.status(201).json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;

    // Remove product from wishlist
    await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('wishlist');

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const isInWishlist = user.wishlist.some(
      (item) => item.toString() === productId
    );

    res.json({ isInWishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
};
