const Product = require('../models/productModel');
const InventoryHistory = require('../models/inventoryModel');
const Order = require('../models/orderModel');

// @desc    Update product inventory
// @route   PUT /api/inventory/:id
// @access  Private/Admin
const updateInventory = async (req, res) => {
  try {
    const { quantity, action, note, variation } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let previousStock = 0;
    let newStock = 0;

    // Handle inventory update based on variation type
    if (variation && variation.type !== 'none') {
      if (variation.type === 'footwear' && variation.footwearSize) {
        // Find the specific footwear size
        const sizeIndex = product.footwearSizes.findIndex(
          (size) => 
            size.ukSize === variation.footwearSize.ukSize && 
            size.usSize === variation.footwearSize.usSize
        );

        if (sizeIndex === -1) {
          return res.status(404).json({ message: 'Size not found' });
        }

        previousStock = product.footwearSizes[sizeIndex].countInStock;

        // Update stock based on action
        if (action === 'add') {
          product.footwearSizes[sizeIndex].countInStock += Number(quantity);
        } else if (action === 'remove') {
          if (product.footwearSizes[sizeIndex].countInStock < Number(quantity)) {
            return res.status(400).json({ message: 'Not enough stock' });
          }
          product.footwearSizes[sizeIndex].countInStock -= Number(quantity);
        } else if (action === 'adjust') {
          product.footwearSizes[sizeIndex].countInStock = Number(quantity);
        }

        newStock = product.footwearSizes[sizeIndex].countInStock;

      } else if (variation.type === 'smartphone' && variation.smartphoneSpec) {
        // Find the specific smartphone spec
        const specIndex = product.smartphoneSpecs.findIndex(
          (spec) => 
            spec.model === variation.smartphoneSpec.model && 
            spec.storage === variation.smartphoneSpec.storage &&
            spec.ram === variation.smartphoneSpec.ram
        );

        if (specIndex === -1) {
          return res.status(404).json({ message: 'Specification not found' });
        }

        previousStock = product.smartphoneSpecs[specIndex].countInStock;

        // Update stock based on action
        if (action === 'add') {
          product.smartphoneSpecs[specIndex].countInStock += Number(quantity);
        } else if (action === 'remove') {
          if (product.smartphoneSpecs[specIndex].countInStock < Number(quantity)) {
            return res.status(400).json({ message: 'Not enough stock' });
          }
          product.smartphoneSpecs[specIndex].countInStock -= Number(quantity);
        } else if (action === 'adjust') {
          product.smartphoneSpecs[specIndex].countInStock = Number(quantity);
        }

        newStock = product.smartphoneSpecs[specIndex].countInStock;
      }
    } else {
      // Handle regular product inventory
      previousStock = product.countInStock;

      // Update stock based on action
      if (action === 'add') {
        product.countInStock += Number(quantity);
      } else if (action === 'remove') {
        if (product.countInStock < Number(quantity)) {
          return res.status(400).json({ message: 'Not enough stock' });
        }
        product.countInStock -= Number(quantity);
      } else if (action === 'adjust') {
        product.countInStock = Number(quantity);
      }

      newStock = product.countInStock;
    }

    // Save the updated product
    await product.save();

    // Create inventory history record
    const inventoryHistory = new InventoryHistory({
      product: productId,
      user: userId,
      action,
      quantity: Number(quantity),
      previousStock,
      newStock,
      note,
      variation: variation || { type: 'none' },
    });

    await inventoryHistory.save();

    res.json({ 
      message: 'Inventory updated successfully',
      product,
      inventoryHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get inventory history for a product
// @route   GET /api/inventory/:id/history
// @access  Private/Admin
const getInventoryHistory = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get inventory history
    const history = await InventoryHistory.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .populate('order', 'orderId');

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all inventory history
// @route   GET /api/inventory/history
// @access  Private/Admin
const getAllInventoryHistory = async (req, res) => {
  try {
    // Get inventory history with pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const history = await InventoryHistory.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('product', 'name imageUrl')
      .populate('user', 'name')
      .populate('order', 'orderId');

    const total = await InventoryHistory.countDocuments();

    res.json({
      history,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get low stock products
// @route   GET /api/inventory/low-stock
// @access  Private/Admin
const getLowStockProducts = async (req, res) => {
  try {
    // Get products with low stock (less than or equal to 5)
    const lowStockProducts = await Product.find({ countInStock: { $lte: 5 } })
      .sort({ countInStock: 1 });

    // Get products with variations that have low stock
    const productsWithVariations = await Product.find({ 
      hasVariations: true,
      $or: [
        { 'footwearSizes.countInStock': { $lte: 5 } },
        { 'smartphoneSpecs.countInStock': { $lte: 5 } }
      ]
    });

    // Process products with variations to extract low stock variations
    const variationsWithLowStock = [];
    
    productsWithVariations.forEach(product => {
      if (product.footwearSizes && product.footwearSizes.length > 0) {
        product.footwearSizes.forEach(size => {
          if (size.countInStock <= 5) {
            variationsWithLowStock.push({
              product: {
                _id: product._id,
                name: product.name,
                imageUrl: product.imageUrl,
                category: product.category
              },
              variation: {
                type: 'footwear',
                details: `UK: ${size.ukSize}, US: ${size.usSize}`,
                countInStock: size.countInStock
              }
            });
          }
        });
      }
      
      if (product.smartphoneSpecs && product.smartphoneSpecs.length > 0) {
        product.smartphoneSpecs.forEach(spec => {
          if (spec.countInStock <= 5) {
            variationsWithLowStock.push({
              product: {
                _id: product._id,
                name: product.name,
                imageUrl: product.imageUrl,
                category: product.category
              },
              variation: {
                type: 'smartphone',
                details: `${spec.model}, ${spec.ram}, ${spec.storage}`,
                countInStock: spec.countInStock
              }
            });
          }
        });
      }
    });

    res.json({
      lowStockProducts,
      variationsWithLowStock
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update inventory after order delivery
// @route   PUT /api/inventory/order/:id/delivered
// @access  Private/Admin
const updateInventoryAfterDelivery = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    // Find the order
    const order = await Order.findById(orderId).populate('orderItems.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order is already delivered
    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Order is already marked as delivered' });
    }

    // Update order status
    order.status = 'delivered';
    await order.save();

    // Process each order item to update inventory
    const inventoryUpdates = [];

    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        continue; // Skip if product not found
      }

      // Handle inventory update based on variation
      if (item.hasVariations) {
        if (item.footwearSize && item.footwearSize.ukSize && item.footwearSize.usSize) {
          // Find the specific footwear size
          const sizeIndex = product.footwearSizes.findIndex(
            (size) => 
              size.ukSize === item.footwearSize.ukSize && 
              size.usSize === item.footwearSize.usSize
          );

          if (sizeIndex !== -1) {
            const previousStock = product.footwearSizes[sizeIndex].countInStock;
            
            // Create inventory history record
            const inventoryHistory = new InventoryHistory({
              product: product._id,
              user: userId,
              action: 'delivery',
              quantity: item.qty,
              previousStock,
              newStock: previousStock, // Stock was already reduced at order placement
              note: `Order ${order.orderId} delivered`,
              variation: {
                type: 'footwear',
                footwearSize: {
                  ukSize: item.footwearSize.ukSize,
                  usSize: item.footwearSize.usSize
                }
              },
              order: order._id
            });

            await inventoryHistory.save();
            inventoryUpdates.push(inventoryHistory);
          }
        } else if (item.smartphoneSpec && item.smartphoneSpec.model) {
          // Find the specific smartphone spec
          const specIndex = product.smartphoneSpecs.findIndex(
            (spec) => 
              spec.model === item.smartphoneSpec.model && 
              spec.storage === item.smartphoneSpec.storage &&
              spec.ram === item.smartphoneSpec.ram
          );

          if (specIndex !== -1) {
            const previousStock = product.smartphoneSpecs[specIndex].countInStock;
            
            // Create inventory history record
            const inventoryHistory = new InventoryHistory({
              product: product._id,
              user: userId,
              action: 'delivery',
              quantity: item.qty,
              previousStock,
              newStock: previousStock, // Stock was already reduced at order placement
              note: `Order ${order.orderId} delivered`,
              variation: {
                type: 'smartphone',
                smartphoneSpec: {
                  model: item.smartphoneSpec.model,
                  storage: item.smartphoneSpec.storage,
                  ram: item.smartphoneSpec.ram
                }
              },
              order: order._id
            });

            await inventoryHistory.save();
            inventoryUpdates.push(inventoryHistory);
          }
        }
      } else {
        // Regular product without variations
        const previousStock = product.countInStock;
        
        // Create inventory history record
        const inventoryHistory = new InventoryHistory({
          product: product._id,
          user: userId,
          action: 'delivery',
          quantity: item.qty,
          previousStock,
          newStock: previousStock, // Stock was already reduced at order placement
          note: `Order ${order.orderId} delivered`,
          variation: { type: 'none' },
          order: order._id
        });

        await inventoryHistory.save();
        inventoryUpdates.push(inventoryHistory);
      }
    }

    res.json({ 
      message: 'Order marked as delivered and inventory updated',
      order,
      inventoryUpdates
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  updateInventory,
  getInventoryHistory,
  getAllInventoryHistory,
  getLowStockProducts,
  updateInventoryAfterDelivery,
};
