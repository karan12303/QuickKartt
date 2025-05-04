const User = require('../models/userModel');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Check if status is valid
    const validStatuses = ['active', 'blocked', 'blacklisted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status: ${status}. Valid options are: ${validStatuses.join(', ')}`
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent updating admin users (except by themselves)
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot update status of admin users' });
    }

    user.status = status;
    user.statusReason = reason || '';

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
      status: updatedUser.status,
      statusReason: updatedUser.statusReason,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users (except by themselves)
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
