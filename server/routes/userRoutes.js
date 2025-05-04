const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and require admin access
router.use(protect);
router.use(admin);

// @route   GET /api/users
// @desc    Get all users
router.get('/', getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get('/:id', getUserById);

// @route   PUT /api/users/:id/status
// @desc    Update user status
router.put('/:id/status', updateUserStatus);

// @route   DELETE /api/users/:id
// @desc    Delete user
router.delete('/:id', deleteUser);

module.exports = router;
