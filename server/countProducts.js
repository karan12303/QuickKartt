require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

const countProducts = async () => {
  try {
    await connectDB();
    const count = await Product.countDocuments({});
    console.log(`Current number of products in database: ${count}`);
    mongoose.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

countProducts();
