const OrderImage = require('../models/orderImageModel');
const Order = require('../models/orderModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/orders');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const orderId = req.params.id;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `order-${orderId}-${uniqueSuffix}${ext}`);
  },
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// @desc    Upload order image
// @route   POST /api/orders/:id/images
// @access  Private
const uploadOrderImage = async (req, res) => {
  try {
    // Check if order exists and belongs to the user
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged in user or if user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to upload images for this order' });
    }

    // Upload is handled by multer middleware
    // Create a single-use upload middleware
    const uploadMiddleware = upload.single('image');

    // Handle the file upload
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ message: 'Please upload an image' });
      }

      console.log('File uploaded successfully:', req.file);

      // Create image URL
      const relativePath = `uploads/orders/${req.file.filename}`;
      const imageUrl = `${req.protocol}://${req.get('host')}/${relativePath}`;

      console.log('File uploaded:', req.file);
      console.log('Generated image URL:', imageUrl);

      // Get type and description from form data
      const type = req.body.type || 'product';
      const description = req.body.description || '';

      console.log('Image type:', type);
      console.log('Image description:', description);

      // Create new order image
      const orderImage = new OrderImage({
        order: req.params.id,
        user: req.user._id,
        imageUrl,
        filename: req.file.filename,
        type,
        description,
      });

      const savedImage = await orderImage.save();
      res.status(201).json(savedImage);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get order images
// @route   GET /api/orders/:id/images
// @access  Private
const getOrderImages = async (req, res) => {
  try {
    // Check if order exists and belongs to the user
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged in user or if user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to view images for this order' });
    }

    // Get all images for the order
    const images = await OrderImage.find({ order: req.params.id })
      .sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete order image
// @route   DELETE /api/orders/:id/images/:imageId
// @access  Private
const deleteOrderImage = async (req, res) => {
  try {
    // Check if order exists and belongs to the user
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged in user or if user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete images for this order' });
    }

    // Find the image
    const image = await OrderImage.findById(req.params.imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if the image belongs to the order
    if (image.order.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Image does not belong to this order' });
    }

    // Delete the file from the server
    const filePath = path.join(__dirname, '../../uploads/orders', image.filename);
    console.log('Attempting to delete file at:', filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File deleted successfully');
    } else {
      console.log('File not found at path:', filePath);
    }

    // Delete the image from the database
    await OrderImage.deleteOne({ _id: image._id });

    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  uploadOrderImage,
  getOrderImages,
  deleteOrderImage,
};
