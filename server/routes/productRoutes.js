const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
// @route   GET /api/products
// @desc    Fetch all products
router.get('/', getProducts);

// @route   GET /api/products/search
// @desc    Search products
router.get('/search', searchProducts);

// @route   GET /api/products/:id
// @desc    Fetch single product
router.get('/:id', getProductById);

// @route   POST /api/products/seed
// @desc    Seed sample products
router.post('/seed', seedProducts);

// Admin routes
// @route   POST /api/products
// @desc    Create a new product
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', protect, admin, deleteProduct);



module.exports = router;
