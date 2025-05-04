const User = require('../models/userModel');

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { fullName, addressLine, city, pinCode, phone, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Create new address
    const newAddress = {
      fullName,
      addressLine,
      city,
      pinCode,
      phone,
      isDefault,
    };

    // If this is the first address or isDefault is true, set all other addresses to not default
    if (user.addresses.length === 0 || isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

// @desc    Get all addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user.addresses);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const { fullName, addressLine, city, pinCode, phone, isDefault } = req.body;
    const addressId = req.params.id;

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Find the address to update
    const address = user.addresses.id(addressId);

    if (!address) {
      res.status(404);
      throw new Error('Address not found');
    }

    // Update address fields
    address.fullName = fullName || address.fullName;
    address.addressLine = addressLine || address.addressLine;
    address.city = city || address.city;
    address.pinCode = pinCode || address.pinCode;
    address.phone = phone || address.phone;

    // If setting this address as default, set all others to not default
    if (isDefault && !address.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Find the address to delete
    const address = user.addresses.id(addressId);

    if (!address) {
      res.status(404);
      throw new Error('Address not found');
    }

    // Remove the address
    user.addresses.pull(addressId);
    await user.save();

    res.json({ message: 'Address removed' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

module.exports = { addAddress, getAddresses, updateAddress, deleteAddress };
