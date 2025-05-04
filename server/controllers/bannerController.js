const BannerSettings = require('../models/bannerSettingsModel');
const Product = require('../models/productModel');
const { mockBannerSettings } = require('../data/mockData');

// Flag to track if MongoDB is available
let isMongoDBAvailable = true;

// Function to check MongoDB connection
const checkMongoDBConnection = async () => {
  try {
    await BannerSettings.findOne();
    isMongoDBAvailable = true;
    return true;
  } catch (error) {
    console.error('MongoDB connection check failed:', error.message);
    isMongoDBAvailable = false;
    return false;
  }
};

// @desc    Get all banner settings
// @route   GET /api/banner
// @access  Public
const getBannerSettings = async (req, res) => {
  try {
    // Check MongoDB connection
    await checkMongoDBConnection();

    // If MongoDB is not available, use mock data
    if (!isMongoDBAvailable) {
      console.log('Using mock banner data since MongoDB is not available');
      return res.json(mockBannerSettings.filter(banner => banner.isActive));
    }

    // Get active banner settings sorted by display order
    const bannerSettings = await BannerSettings.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .populate('productId', 'name price imageUrl countInStock');

    res.json(bannerSettings);
  } catch (error) {
    console.error('Error fetching banner settings:', error);

    // If there's an error, try to use mock data
    try {
      console.log('Using mock banner data due to error');
      return res.json(mockBannerSettings.filter(banner => banner.isActive));
    } catch (mockError) {
      console.error('Error using mock banner data:', mockError);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
};

// @desc    Get all banner settings (including inactive) for admin
// @route   GET /api/banner/admin
// @access  Private/Admin
const getAllBannerSettings = async (req, res) => {
  try {
    // Get all banner settings sorted by display order
    const bannerSettings = await BannerSettings.find()
      .sort({ displayOrder: 1 })
      .populate('productId', 'name price imageUrl countInStock');

    res.json(bannerSettings);
  } catch (error) {
    console.error('Error fetching banner settings:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a product to banner
// @route   POST /api/banner
// @access  Private/Admin
const addProductToBanner = async (req, res) => {
  try {
    const { productId, title, subtitle, displayOrder, color } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is already in banner
    const existingBannerSetting = await BannerSettings.findOne({ productId });
    if (existingBannerSetting) {
      return res.status(400).json({ message: 'Product already in banner' });
    }

    // Create new banner setting
    const bannerSetting = new BannerSettings({
      productId,
      title: title || 'Featured Product',
      subtitle: subtitle || 'Discover our premium selection.',
      displayOrder: displayOrder || 0,
      color: color || 'primary',
    });

    const createdBannerSetting = await bannerSetting.save();

    // Populate product details for response
    await createdBannerSetting.populate('productId', 'name price imageUrl countInStock');

    res.status(201).json(createdBannerSetting);
  } catch (error) {
    console.error('Error adding product to banner:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update banner setting
// @route   PUT /api/banner/:id
// @access  Private/Admin
const updateBannerSetting = async (req, res) => {
  try {
    const { title, subtitle, displayOrder, isActive, color } = req.body;

    const bannerSetting = await BannerSettings.findById(req.params.id);
    if (!bannerSetting) {
      return res.status(404).json({ message: 'Banner setting not found' });
    }

    // Update fields
    bannerSetting.title = title || bannerSetting.title;
    bannerSetting.subtitle = subtitle || bannerSetting.subtitle;
    bannerSetting.displayOrder = displayOrder !== undefined ? displayOrder : bannerSetting.displayOrder;
    bannerSetting.isActive = isActive !== undefined ? isActive : bannerSetting.isActive;
    bannerSetting.color = color || bannerSetting.color;

    const updatedBannerSetting = await bannerSetting.save();

    // Populate product details for response
    await updatedBannerSetting.populate('productId', 'name price imageUrl countInStock');

    res.json(updatedBannerSetting);
  } catch (error) {
    console.error('Error updating banner setting:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Remove product from banner
// @route   DELETE /api/banner/:id
// @access  Private/Admin
const removeProductFromBanner = async (req, res) => {
  try {
    const bannerSetting = await BannerSettings.findById(req.params.id);
    if (!bannerSetting) {
      return res.status(404).json({ message: 'Banner setting not found' });
    }

    // Use deleteOne instead of remove (which is deprecated)
    await BannerSettings.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed from banner' });
  } catch (error) {
    console.error('Error removing product from banner:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Reorder banner products
// @route   PUT /api/banner/reorder
// @access  Private/Admin
const reorderBannerProducts = async (req, res) => {
  try {
    const { bannerOrder } = req.body;

    // bannerOrder should be an array of { id, displayOrder } objects
    if (!Array.isArray(bannerOrder)) {
      return res.status(400).json({ message: 'Invalid banner order format' });
    }

    // Update each banner setting with new display order
    const updatePromises = bannerOrder.map(item => {
      return BannerSettings.findByIdAndUpdate(
        item.id,
        { displayOrder: item.displayOrder },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Get updated banner settings
    const updatedBannerSettings = await BannerSettings.find()
      .sort({ displayOrder: 1 })
      .populate('productId', 'name price imageUrl countInStock');

    res.json(updatedBannerSettings);
  } catch (error) {
    console.error('Error reordering banner products:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getBannerSettings,
  getAllBannerSettings,
  addProductToBanner,
  updateBannerSetting,
  removeProductFromBanner,
  reorderBannerProducts,
};
