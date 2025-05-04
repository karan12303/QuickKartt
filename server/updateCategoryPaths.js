const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const updateCategoryPaths = async () => {
  try {
    console.log('Starting category path update...');
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products in database`);
    
    // Update each product's category to ensure it has a proper path
    for (const product of products) {
      const oldCategory = product.category;
      let newCategory = oldCategory;
      
      // Skip products that already have a proper category path
      if (oldCategory.includes('>')) {
        console.log(`Skipping ${product.name}: already has proper category path (${oldCategory})`);
        continue;
      }
      
      // Map old categories to new category paths
      switch(oldCategory) {
        case 'Electronics':
          newCategory = 'Electronics > TV & Home Entertainment > Headphones & Earphones';
          break;
        case 'Smartphone':
          newCategory = 'Electronics > Mobiles & Accessories > Smartphones';
          break;
        case 'Footwear':
          newCategory = 'Fashion > Men\'s Fashion > Footwear';
          break;
        case 'Home':
          newCategory = 'Home & Kitchen > Home Appliances > Small Appliances';
          break;
        case 'Fashion and Accessories':
        case 'Accessories':
          newCategory = 'Fashion > Men\'s Fashion > Accessories';
          break;
        default:
          // Try to match based on product name
          if (product.name.includes('iPhone') || product.name.includes('Samsung') || product.name.includes('Galaxy')) {
            newCategory = 'Electronics > Mobiles & Accessories > Smartphones';
          } else if (product.name.includes('Headphones') || product.name.includes('Earphones')) {
            newCategory = 'Electronics > TV & Home Entertainment > Headphones & Earphones';
          } else if (product.name.includes('Shoes') || product.name.includes('Nike') || product.name.includes('Adidas')) {
            newCategory = 'Fashion > Men\'s Fashion > Footwear';
          } else if (product.name.includes('Coffee') || product.name.includes('Maker')) {
            newCategory = 'Home & Kitchen > Home Appliances > Small Appliances';
          } else if (product.name.includes('Backpack') || product.name.includes('Bag')) {
            newCategory = 'Fashion > Men\'s Fashion > Accessories';
          } else if (product.name.includes('Fitness') || product.name.includes('Tracker')) {
            newCategory = 'Electronics > Wearable Devices';
          } else {
            console.log(`No category mapping found for ${product.name} (${oldCategory})`);
          }
      }
      
      // Update the product if the category changed
      if (newCategory !== oldCategory) {
        product.category = newCategory;
        await product.save();
        console.log(`Updated ${product.name}: ${oldCategory} -> ${newCategory}`);
      }
    }
    
    console.log('Category path update completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateCategoryPaths();
