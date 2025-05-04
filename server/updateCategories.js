const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const updateCategories = async () => {
  try {
    // Find all products with the old category name
    const products = await Product.find({ category: 'Accessories' });
    
    console.log(`Found ${products.length} products with category 'Accessories'`);
    
    // Update each product with the new category name
    for (const product of products) {
      product.category = 'Fashion and Accessories';
      await product.save();
      console.log(`Updated product: ${product.name}`);
    }
    
    console.log('Category update completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateCategories();
