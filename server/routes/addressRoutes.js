const express = require('express');
const router = express.Router();
const { 
  addAddress, 
  getAddresses, 
  updateAddress, 
  deleteAddress 
} = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// @route   POST /api/users/addresses
// @desc    Add a new address
router.post('/', addAddress);

// @route   GET /api/users/addresses
// @desc    Get all addresses
router.get('/', getAddresses);

// @route   PUT /api/users/addresses/:id
// @desc    Update address
router.put('/:id', updateAddress);

// @route   DELETE /api/users/addresses/:id
// @desc    Delete address
router.delete('/:id', deleteAddress);

module.exports = router;
