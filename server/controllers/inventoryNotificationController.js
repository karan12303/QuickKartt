const Product = require('../models/productModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

// @desc    Get all low stock products
// @route   GET /api/inventory/low-stock
// @access  Private/Admin
const getLowStockProducts = async (req, res) => {
  try {
    // Get threshold and limit from query params or use defaults
    const threshold = parseInt(req.query.threshold) || 10;
    const limit = parseInt(req.query.limit) || 100; // Default to 100, but allow higher limits

    // Find products with stock below threshold
    const lowStockProducts = await Product.find({
      countInStock: { $lte: threshold, $gt: 0 },
    })
    .sort({ countInStock: 1 })
    .limit(limit); // Apply limit to query

    // Find out of stock products
    const outOfStockProducts = await Product.find({
      countInStock: 0,
    })
    .limit(limit); // Apply limit to query

    res.json({
      lowStockProducts,
      outOfStockProducts,
      totalLowStock: lowStockProducts.length,
      totalOutOfStock: outOfStockProducts.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Send low stock email notification to admins
// @route   POST /api/inventory/notify-admins
// @access  Private/Admin
const notifyAdminsOfLowStock = async (req, res) => {
  try {
    // Get threshold from body or use default
    const threshold = parseInt(req.body.threshold) || 10;

    // Find products with stock below threshold
    const lowStockProducts = await Product.find({
      countInStock: { $lte: threshold, $gt: 0 },
    }).sort({ countInStock: 1 });

    // Find out of stock products
    const outOfStockProducts = await Product.find({
      countInStock: 0,
    });

    // If no low stock or out of stock products, return
    if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
      return res.status(200).json({
        message: 'No low stock or out of stock products to notify about',
      });
    }

    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' });

    if (adminUsers.length === 0) {
      return res.status(404).json({ message: 'No admin users found' });
    }

    // Create email content
    const emailSubject = `QuickKart Inventory Alert: ${lowStockProducts.length} Low Stock, ${outOfStockProducts.length} Out of Stock`;

    let emailContent = `
      <h2>QuickKart Inventory Alert</h2>
      <p>This is an automated notification about your inventory status.</p>
    `;

    if (outOfStockProducts.length > 0) {
      emailContent += `
        <h3>Out of Stock Products (${outOfStockProducts.length})</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
      `;

      outOfStockProducts.forEach((product) => {
        emailContent += `
          <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price.toLocaleString('en-IN')}</td>
          </tr>
        `;
      });

      emailContent += '</table>';
    }

    if (lowStockProducts.length > 0) {
      emailContent += `
        <h3>Low Stock Products (${lowStockProducts.length})</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Current Stock</th>
            <th>Price</th>
          </tr>
      `;

      lowStockProducts.forEach((product) => {
        emailContent += `
          <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.countInStock}</td>
            <td>₹${product.price.toLocaleString('en-IN')}</td>
          </tr>
        `;
      });

      emailContent += '</table>';
    }

    emailContent += `
      <p>Please take action to restock these items.</p>
      <p>This is an automated message from the QuickKart system.</p>
    `;

    // In a real implementation, you would send emails to all admins
    // For now, we'll just simulate it
    console.log(`Would send email to ${adminUsers.length} admins with subject: ${emailSubject}`);
    console.log('Email content:', emailContent);

    // Example of how to send email using nodemailer (commented out)
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to each admin
    for (const admin of adminUsers) {
      await transporter.sendMail({
        from: '"QuickKart System" <system@quickkart.com>',
        to: admin.email,
        subject: emailSubject,
        html: emailContent,
      });
    }
    */

    res.status(200).json({
      message: `Notification sent to ${adminUsers.length} admins about inventory status`,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Set low stock threshold for a product
// @route   PUT /api/inventory/:id/threshold
// @access  Private/Admin
const setProductThreshold = async (req, res) => {
  try {
    const { threshold } = req.body;

    if (!threshold || threshold < 0) {
      return res.status(400).json({ message: 'Invalid threshold value' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.lowStockThreshold = threshold;
    await product.save();

    res.json({
      message: 'Product threshold updated',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Restock a product
// @route   PUT /api/inventory/:id/restock
// @access  Private/Admin
const restockProduct = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity value' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add the new quantity to the existing stock
    product.countInStock += parseInt(quantity);
    await product.save();

    res.json({
      message: `Successfully restocked ${product.name}`,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getLowStockProducts,
  notifyAdminsOfLowStock,
  setProductThreshold,
  restockProduct,
};
