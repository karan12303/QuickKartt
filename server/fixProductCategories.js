const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const fixProductCategories = async () => {
  try {
    console.log('Starting product category fix...');

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products in database`);

    // Fix each product's category
    for (const product of products) {
      const oldCategory = product.category;

      // Skip products that already have a proper category path
      if (oldCategory.includes('>')) {
        console.log(`Skipping ${product.name}: already has proper category path (${oldCategory})`);
        continue;
      }

      // Fix the category based on the product name or existing category
      let newCategory = oldCategory;

      // Electronics
      if (
        oldCategory === 'Electronics' ||
        product.name.includes('Headphones') ||
        product.name.includes('Wireless')
      ) {
        newCategory = 'Electronics > TV & Home Entertainment > Headphones & Earphones';
      }

      // Smartphones
      else if (
        oldCategory === 'Smartphone' ||
        product.name.includes('iPhone') ||
        product.name.includes('Galaxy') ||
        product.name.includes('Samsung')
      ) {
        newCategory = 'Electronics > Mobiles & Accessories > Smartphones';
      }

      // Footwear
      else if (
        oldCategory === 'Footwear' ||
        product.name.includes('Shoes') ||
        product.name.includes('Nike') ||
        product.name.includes('Adidas') ||
        product.name.includes('Jordan')
      ) {
        newCategory = 'Fashion > Men\'s Fashion > Footwear';
      }

      // Home appliances
      else if (
        oldCategory === 'Home' ||
        product.name.includes('Coffee Maker') ||
        product.name.includes('Maker')
      ) {
        newCategory = 'Home & Kitchen > Home Appliances > Small Appliances';
      }

      // Fashion accessories
      else if (
        oldCategory === 'Fashion and Accessories' ||
        oldCategory === 'Accessories' ||
        product.name.includes('Backpack') ||
        product.name.includes('Bag')
      ) {
        newCategory = 'Fashion > Men\'s Fashion > Accessories';
      }

      // Fitness trackers
      else if (product.name.includes('Fitness') || product.name.includes('Tracker')) {
        newCategory = 'Electronics > Wearable Devices';
      }

      // Update the product if the category changed
      if (newCategory !== oldCategory) {
        product.category = newCategory;
        await product.save();
        console.log(`Updated ${product.name}: ${oldCategory} -> ${newCategory}`);
      } else {
        console.log(`No category change needed for ${product.name} (${oldCategory})`);
      }
    }

    console.log('Product category fix completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

fixProductCategories();
