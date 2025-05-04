require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

const checkProducts = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected');
    
    // Get total product count
    const totalCount = await Product.countDocuments({});
    console.log(`Total products in database: ${totalCount}`);
    
    // Get count by category (top level)
    const categories = await Product.aggregate([
      {
        $group: {
          _id: {
            $arrayElemAt: [{ $split: ["$category", " > "] }, 0]
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nProducts by main category:');
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} products`);
    });
    
    // Get some sample products from each main category
    console.log('\nSample products from each category:');
    for (const cat of categories) {
      const mainCat = cat._id;
      const samples = await Product.find({ 
        category: { $regex: new RegExp('^' + mainCat, 'i') } 
      })
      .select('name category price')
      .limit(3);
      
      console.log(`\n${mainCat}:`);
      samples.forEach(product => {
        console.log(`- ${product.name} (${product.category}) - ₹${product.price}`);
      });
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

checkProducts();
