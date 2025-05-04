const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const connectDB = require('./config/db');
const bannerProducts = require('./data/bannerProducts');

dotenv.config();

connectDB();

const seedAdmin = async () => {
  try {
    // Clear all existing users
    await User.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'john123',
    });

    console.log('Admin user created:');
    console.log(`Email: admin@example.com`);
    console.log(`Password: admin123`);
    console.log('\nRegular user created:');
    console.log(`Email: john@example.com`);
    console.log(`Password: john123`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedBannerProducts = async () => {
  try {
    // Don't clear existing products, just add banner products
    console.log('Adding banner products...');

    // Check if banner products already exist
    for (const product of bannerProducts) {
      const existingProduct = await Product.findOne({ name: product.name });

      if (!existingProduct) {
        await Product.create(product);
        console.log(`Added: ${product.name}`);
      } else {
        console.log(`Product already exists: ${product.name}`);
      }
    }

    console.log('Banner products added successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else if (process.argv[2] === '-b') {
  seedBannerProducts();
} else {
  seedAdmin();
}
