const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', loginUser);

// @route   POST /api/auth/send-otp
// @desc    Send OTP to mobile number
router.post('/send-otp', sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login user
router.post('/verify-otp', verifyOTP);

// @route   GET /api/auth/profile
// @desc    Get user profile
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, updateUserProfile);

module.exports = router;
