const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    // Get total sales
    const totalSales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    // Get sales by date (last 7 days)
    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const salesByDate = await Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get sales by payment method
    const salesByPaymentMethod = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          totalSold: { $sum: '$orderItems.qty' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          totalSold: 1,
          totalRevenue: 1,
          imageUrl: '$productInfo.imageUrl',
          category: '$productInfo.category',
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
      salesByDate,
      salesByPaymentMethod,
      topSellingProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get order analytics
// @route   GET /api/analytics/orders
// @access  Private/Admin
const getOrderAnalytics = async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get orders by date (last 7 days)
    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const ordersByDate = await Order.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get average order value
    const avgOrderValue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, avg: { $avg: '$totalPrice' } } },
    ]);

    res.json({
      totalOrders,
      ordersByStatus,
      ordersByDate,
      avgOrderValue: avgOrderValue.length > 0 ? avgOrderValue[0].avg : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const getUserAnalytics = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();

    // Get users by status
    const usersByStatus = await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get new users (last 7 days)
    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newUsers = await User.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalUsers,
      usersByStatus,
      usersByRole,
      newUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private/Admin
const getProductAnalytics = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get out of stock products
    const outOfStockProducts = await Product.countDocuments({ countInStock: 0 });

    // Get low stock products (less than 5)
    const lowStockProducts = await Product.find({ countInStock: { $gt: 0, $lte: 5 } })
      .select('name imageUrl category countInStock')
      .sort({ countInStock: 1 });

    res.json({
      totalProducts,
      productsByCategory,
      outOfStockProducts,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get dashboard summary
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardSummary = async (req, res) => {
  try {
    // Get total sales
    const totalSales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    // Get out of stock products count
    const outOfStockProducts = await Product.countDocuments({ countInStock: 0 });

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Get sales by date (last 7 days)
    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const salesByDate = await Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          total: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
      outOfStockProducts,
      pendingOrders,
      salesByDate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getSalesAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
  getProductAnalytics,
  getDashboardSummary,
};
