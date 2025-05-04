const Product = require('../models/productModel');
const { mockProducts } = require('../data/mockData');
const { isConnected } = require('../config/db');

// Function to check MongoDB connection with better error handling
const checkMongoDBConnection = async () => {
  try {
    // First check the connection state
    const connected = isConnected();

    if (!connected) {
      console.log('MongoDB is not connected according to connection state');
      return false;
    }

    // Double-check with a simple query
    try {
      await Product.findOne().lean().limit(1).maxTimeMS(5000);
      console.log('MongoDB connection verified with successful query');
      return true;
    } catch (queryError) {
      console.error('MongoDB query check failed:', queryError.message);

      // If the query fails but connection state is connected,
      // we'll still return true and let the actual query handle any specific errors
      console.log('Using connection state as fallback indicator');
      return connected;
    }
  } catch (error) {
    console.error('MongoDB connection check failed:', error.message);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
};

// @desc    Fetch all products with pagination and limit
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    console.log('Fetching products...');

    // Parse query parameters with defaults
    const {
      limit = 12,
      page = 1,
      sort = 'createdAt',
      order = 'desc',
      category = ''
    } = req.query;

    console.log(`Query params: limit=${limit}, page=${page}, sort=${sort}, order=${order}, category=${category}`);

    // Check MongoDB connection
    const isMongoDBAvailable = await checkMongoDBConnection();
    console.log(`MongoDB available: ${isMongoDBAvailable}`);

    // If MongoDB is not available, use mock data
    if (!isMongoDBAvailable) {
      console.log('Using mock product data since MongoDB is not available');

      // Filter mock products by category if specified
      let filteredProducts = mockProducts;
      if (category) {
        const categoryRegex = new RegExp(category, 'i');
        filteredProducts = mockProducts.filter(p => categoryRegex.test(p.category));
      }

      // Sort mock products
      filteredProducts = filteredProducts.sort((a, b) => {
        if (sort === 'price') {
          return order === 'desc' ? b.price - a.price : a.price - b.price;
        }
        // Default sort by name
        return order === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      });

      // Apply pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      console.log(`Returning ${paginatedProducts.length} mock products`);
      return res.json({
        products: paginatedProducts,
        page: Number(page),
        pages: Math.ceil(filteredProducts.length / Number(limit)),
        total: filteredProducts.length,
        source: 'mock'
      });
    }

    // If MongoDB is available, proceed with database query
    console.log('Using MongoDB for product data');

    // Build query
    const query = {};
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    try {
      // Count total products for pagination info
      console.log('Counting documents with query:', JSON.stringify(query));
      const count = await Product.countDocuments(query);
      console.log(`Found ${count} total products matching query`);

      // Build sort options
      const sortOptions = {};
      sortOptions[sort] = order === 'desc' ? -1 : 1;
      console.log('Sort options:', JSON.stringify(sortOptions));

      // Execute query with pagination, sorting and limit
      console.log('Executing find query with pagination');
      const products = await Product.find(query)
        .sort(sortOptions)
        .limit(Number(limit))
        .skip(Number(limit) * (Number(page) - 1))
        .lean(); // Use lean() for better performance

      console.log(`Returning ${products.length} products from database`);

      // Add pagination info
      return res.json({
        products,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        total: count,
        source: 'database'
      });
    } catch (dbError) {
      console.error('Error querying MongoDB:', dbError);
      throw dbError; // Re-throw to be caught by outer catch block
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error stack:', error.stack);

    // If there's an error, try to use mock data as fallback
    try {
      console.log('Using mock product data as fallback due to error');
      const {
        limit = 12,
        page = 1,
        category = ''
      } = req.query;

      // Filter mock products by category if specified
      let filteredProducts = mockProducts;
      if (category) {
        const categoryRegex = new RegExp(category, 'i');
        filteredProducts = mockProducts.filter(p => categoryRegex.test(p.category));
      }

      // Apply pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      console.log(`Returning ${paginatedProducts.length} mock products as fallback`);
      return res.json({
        products: paginatedProducts,
        page: Number(page),
        pages: Math.ceil(filteredProducts.length / Number(limit)),
        total: filteredProducts.length,
        source: 'mock-fallback'
      });
    } catch (mockError) {
      console.error('Error using mock data:', mockError);
      return res.status(500).json({
        message: 'Server Error',
        error: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
        details: 'Failed to fetch products from both database and mock data'
      });
    }
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      // If no query is provided, return all products instead of an error
      const products = await Product.find({});
      return res.json(products);
    }

    // Create a case-insensitive regex for the search query
    const searchRegex = new RegExp(query, 'i');

    // Search in name, description, and category fields
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    let productId = req.params.id;

    // Validate if the ID is a valid MongoDB ObjectId
    console.log('Product ID received:', productId);
    console.log('Product ID type:', typeof productId);
    console.log('Request URL:', req.originalUrl);

    // Handle the case where the ID is '[object Object]'
    if (productId === '[object Object]' || productId === '[object%20Object]') {
      // Try to extract the product ID from the URL
      const match = req.originalUrl.match(/\/api\/products\/([0-9a-fA-F]{24})/);
      if (match && match[1]) {
        productId = match[1];
        console.log('Extracted product ID from URL:', productId);
      } else {
        console.log('Invalid object ID detected. Sending error response.');
        return res.status(400).json({
          message: 'Invalid product ID: received [object Object] instead of a valid ID',
          error: 'Please try refreshing the page or going back to the product list.'
        });
      }
    }

    // Handle the case where the ID is an actual object
    if (typeof productId === 'object') {
      console.log('Product ID is an object:', productId);
      // Try to extract the _id property if it exists
      if (productId._id) {
        productId = productId._id.toString();
        console.log('Extracted _id from object:', productId);
      } else {
        return res.status(400).json({
          message: 'Invalid product ID: received an object without _id property',
          error: 'Please try refreshing the page or going back to the product list.'
        });
      }
    }

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: `Invalid product ID format: ${productId}`,
        error: 'Please try refreshing the page or going back to the product list.'
      });
    }

    // Use the validated productId instead of req.params.id
    const product = await Product.findById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        message: 'Product not found',
        error: 'The requested product could not be found. It may have been removed or is no longer available.'
      });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      additionalImages,
      category,
      countInStock,
      footwearSizes,
      smartphoneSpecs,
      hasVariations
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      additionalImages: additionalImages || [],
      category,
      countInStock,
      footwearSizes: footwearSizes || [],
      smartphoneSpecs: smartphoneSpecs || [],
      hasVariations: hasVariations || false
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      additionalImages,
      category,
      countInStock,
      footwearSizes,
      smartphoneSpecs,
      hasVariations
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.imageUrl = imageUrl || product.imageUrl;

      // Handle additionalImages - if it's provided, replace the existing array
      if (additionalImages) {
        product.additionalImages = additionalImages;
      }

      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      // Handle variations
      if (footwearSizes) {
        product.footwearSizes = footwearSizes;
      }

      if (smartphoneSpecs) {
        product.smartphoneSpecs = smartphoneSpecs;
      }

      // Update hasVariations flag
      if (hasVariations !== undefined) {
        product.hasVariations = hasVariations;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create sample products (for testing)
// @route   POST /api/products/seed
// @access  Public
const seedProducts = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        description: 'High-quality wireless headphones with noise cancellation',
        category: 'Electronics',
        price: 7499,
        countInStock: 10,
      },
      {
        name: 'iPhone 14 Pro',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        description: 'Latest iPhone model with advanced camera system and powerful performance',
        category: 'Smartphone',
        price: 89999,
        countInStock: 0, // Overall count is 0, but variations have stock
        hasVariations: true,
        smartphoneSpecs: [
          {
            model: 'iPhone 14 Pro',
            storage: '128GB',
            ram: '6GB',
            countInStock: 5
          },
          {
            model: 'iPhone 14 Pro',
            storage: '256GB',
            ram: '6GB',
            countInStock: 3
          },
          {
            model: 'iPhone 14 Pro',
            storage: '512GB',
            ram: '6GB',
            countInStock: 2
          }
        ]
      },
      {
        name: 'Samsung Galaxy S23',
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
        description: 'Flagship Android smartphone with stunning display and powerful camera',
        category: 'Smartphone',
        price: 74999,
        countInStock: 0, // Overall count is 0, but variations have stock
        hasVariations: true,
        smartphoneSpecs: [
          {
            model: 'Galaxy S23',
            storage: '128GB',
            ram: '8GB',
            countInStock: 4
          },
          {
            model: 'Galaxy S23',
            storage: '256GB',
            ram: '8GB',
            countInStock: 3
          },
          {
            model: 'Galaxy S23 Ultra',
            storage: '512GB',
            ram: '12GB',
            countInStock: 2
          }
        ]
      },
      {
        name: 'Nike Air Max Running Shoes',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        description: 'Comfortable running shoes with excellent support and cushioning',
        category: 'Footwear',
        price: 8999,
        countInStock: 0, // Overall count is 0, but variations have stock
        hasVariations: true,
        footwearSizes: [
          {
            ukSize: '6',
            usSize: '7',
            countInStock: 3
          },
          {
            ukSize: '7',
            usSize: '8',
            countInStock: 5
          },
          {
            ukSize: '8',
            usSize: '9',
            countInStock: 4
          },
          {
            ukSize: '9',
            usSize: '10',
            countInStock: 2
          },
          {
            ukSize: '10',
            usSize: '11',
            countInStock: 1
          }
        ]
      },
      {
        name: 'Adidas Ultraboost',
        imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c',
        description: 'Premium running shoes with responsive cushioning and adaptive support',
        category: 'Footwear',
        price: 12999,
        countInStock: 0, // Overall count is 0, but variations have stock
        hasVariations: true,
        footwearSizes: [
          {
            ukSize: '6',
            usSize: '7',
            countInStock: 2
          },
          {
            ukSize: '7',
            usSize: '8',
            countInStock: 3
          },
          {
            ukSize: '8',
            usSize: '9',
            countInStock: 4
          },
          {
            ukSize: '9',
            usSize: '10',
            countInStock: 3
          },
          {
            ukSize: '10',
            usSize: '11',
            countInStock: 2
          }
        ]
      },
      {
        name: 'Coffee Maker',
        imageUrl: 'https://images.unsplash.com/photo-1570087935869-9da023a88cdc',
        description: 'Programmable coffee maker for perfect morning brew',
        category: 'Home',
        price: 3999,
        countInStock: 7,
      },
      {
        name: 'Backpack',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        description: 'Durable backpack with multiple compartments',
        category: 'Fashion and Accessories',
        price: 2999,
        countInStock: 15,
      },
      {
        name: 'Fitness Tracker',
        imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6',
        description: 'Track your steps, heart rate, and sleep patterns',
        category: 'Electronics',
        price: 6499,
        countInStock: 6,
      },
    ];

    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(sampleProducts);

    res.json(createdProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts
};
