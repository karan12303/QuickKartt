const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Validate that at least one of email or mobile is provided
    if (!email && !mobile) {
      res.status(400);
      throw new Error('Either email or mobile number is required');
    }

    // Check if user exists with email
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email is already registered');
      }
    }

    // Check if user exists with mobile
    if (mobile) {
      const mobileExists = await User.findOne({ mobile });
      if (mobileExists) {
        res.status(400);
        throw new Error('Mobile number is already registered');
      }
    }

    // Create user
    const userData = {
      name,
      password,
    };

    // Add email or mobile if provided
    if (email) userData.email = email;
    if (mobile) userData.mobile = mobile;

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Email is required');
    }

    // Check for user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check if password matches
    if (!(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check if user is blocked or blacklisted
    if (user.status === 'blocked') {
      res.status(403);
      throw new Error('Your account has been blocked. Please contact support.');
    }

    if (user.status === 'blacklisted') {
      res.status(403);
      throw new Error('Your account has been blacklisted. Access denied.');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        addresses: user.addresses,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
