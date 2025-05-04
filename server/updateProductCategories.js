const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const connectDB = require('./config/db');
const { flatCategories } = require('../client/src/data/categories');

dotenv.config();

connectDB();

// Map of old categories to new categories
const categoryMapping = {
  'Electronics': 'Electronics > Computers & Accessories > Computer Accessories',
  'Smartphone': 'Electronics > Mobiles & Accessories > Smartphones',
  'Footwear': 'Fashion > Men\'s Fashion > Footwear',
  'Home': 'Home & Kitchen > Home Appliances > Small Appliances',
  'Fashion and Accessories': 'Fashion > Men\'s Fashion > Accessories'
};

// New products to add with Amazon-like categories
const newProducts = [
  // Electronics
  {
    name: 'Dell XPS 13 Laptop',
    imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6',
    description: 'Powerful laptop with 13-inch display, Intel Core i7, 16GB RAM, and 512GB SSD',
    category: 'Electronics > Computers & Accessories > Laptops',
    price: 129999,
    countInStock: 5,
  },
  {
    name: 'Sony WH-1000XM4 Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
    description: 'Premium noise-cancelling headphones with exceptional sound quality',
    category: 'Electronics > TV & Home Entertainment > Headphones & Earphones',
    price: 24999,
    countInStock: 8,
  },
  {
    name: 'Canon EOS R5 Camera',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    description: 'Professional mirrorless camera with 45MP sensor and 8K video recording',
    category: 'Electronics > Cameras & Photography > Mirrorless Cameras',
    price: 339999,
    countInStock: 3,
  },
  {
    name: 'PlayStation 5 Console',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db',
    description: 'Next-generation gaming console with ultra-high-speed SSD and 4K gaming',
    category: 'Electronics > Gaming > Gaming Consoles',
    price: 49999,
    countInStock: 2,
  },
  
  // Fashion
  {
    name: 'Men\'s Casual Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
    description: 'Comfortable cotton casual shirt for men',
    category: 'Fashion > Men\'s Fashion > Clothing',
    price: 1999,
    countInStock: 20,
  },
  {
    name: 'Women\'s Summer Dress',
    imageUrl: 'https://images.unsplash.com/photo-1623609163859-ca93c959b5b8',
    description: 'Elegant summer dress with floral pattern',
    category: 'Fashion > Women\'s Fashion > Clothing',
    price: 2499,
    countInStock: 15,
  },
  {
    name: 'Leather Wallet',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
    description: 'Genuine leather wallet with multiple card slots',
    category: 'Fashion > Men\'s Fashion > Accessories',
    price: 1499,
    countInStock: 25,
  },
  {
    name: 'Women\'s Handbag',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    description: 'Stylish handbag with spacious compartments',
    category: 'Fashion > Women\'s Fashion > Handbags & Clutches',
    price: 3499,
    countInStock: 10,
  },
  
  // Home & Kitchen
  {
    name: 'Non-Stick Cookware Set',
    imageUrl: 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783',
    description: 'Complete non-stick cookware set for your kitchen',
    category: 'Home & Kitchen > Kitchen & Dining > Cookware',
    price: 4999,
    countInStock: 7,
  },
  {
    name: 'Microwave Oven',
    imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078',
    description: 'Compact microwave oven with multiple cooking modes',
    category: 'Home & Kitchen > Home Appliances > Microwave Ovens',
    price: 8999,
    countInStock: 5,
  },
  {
    name: 'Sofa Set',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    description: 'Comfortable 3-seater sofa set for your living room',
    category: 'Home & Kitchen > Furniture > Living Room Furniture',
    price: 29999,
    countInStock: 3,
  },
  {
    name: 'Wall Clock',
    imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c',
    description: 'Elegant wall clock for home decoration',
    category: 'Home & Kitchen > Home Décor > Wall Décor',
    price: 1499,
    countInStock: 12,
  },
  
  // Beauty & Personal Care
  {
    name: 'Makeup Kit',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
    description: 'Complete makeup kit with various products',
    category: 'Beauty & Personal Care > Makeup > Makeup Sets & Kits',
    price: 2999,
    countInStock: 8,
  },
  {
    name: 'Face Moisturizer',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
    description: 'Hydrating face moisturizer for all skin types',
    category: 'Beauty & Personal Care > Skincare > Face Care',
    price: 999,
    countInStock: 15,
  },
  {
    name: 'Shampoo & Conditioner Set',
    imageUrl: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd',
    description: 'Nourishing shampoo and conditioner set for healthy hair',
    category: 'Beauty & Personal Care > Haircare > Shampoo & Conditioner',
    price: 799,
    countInStock: 20,
  },
  {
    name: 'Men\'s Perfume',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f',
    description: 'Long-lasting men\'s perfume with woody notes',
    category: 'Beauty & Personal Care > Fragrances > Men\'s Fragrances',
    price: 1999,
    countInStock: 10,
  },
  
  // Grocery & Gourmet Foods
  {
    name: 'Assorted Snacks Box',
    imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60',
    description: 'Box of assorted snacks and chips',
    category: 'Grocery & Gourmet Foods > Packaged Foods > Snacks & Chips',
    price: 599,
    countInStock: 25,
  },
  {
    name: 'Premium Tea Collection',
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
    description: 'Collection of premium tea varieties',
    category: 'Grocery & Gourmet Foods > Beverages > Tea',
    price: 899,
    countInStock: 15,
  },
  {
    name: 'Basmati Rice',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac',
    description: 'Premium quality basmati rice, 5kg pack',
    category: 'Grocery & Gourmet Foods > Staples > Rice & Flour',
    price: 799,
    countInStock: 30,
  },
  {
    name: 'Chocolate Gift Box',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b',
    description: 'Assorted chocolate gift box for special occasions',
    category: 'Grocery & Gourmet Foods > Gourmet Foods > Chocolates & Desserts',
    price: 1299,
    countInStock: 12,
  },
  
  // Sports & Fitness
  {
    name: 'Yoga Mat',
    imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2',
    description: 'Non-slip yoga mat for comfortable practice',
    category: 'Sports & Fitness > Exercise & Fitness > Yoga',
    price: 999,
    countInStock: 18,
  },
  {
    name: 'Cricket Bat',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
    description: 'Professional cricket bat for sports enthusiasts',
    category: 'Sports & Fitness > Outdoor Sports > Cricket',
    price: 2499,
    countInStock: 8,
  },
  {
    name: 'Men\'s Running Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1562183241-b937e95585b6',
    description: 'Comfortable running shoes for men',
    category: 'Sports & Fitness > Sportswear > Sports Footwear',
    price: 3999,
    countInStock: 10,
  },
  {
    name: 'Fitness Dumbbells Set',
    imageUrl: 'https://images.unsplash.com/photo-1590771998996-8589ec9b5ac6',
    description: 'Set of dumbbells for strength training',
    category: 'Sports & Fitness > Exercise & Fitness > Strength Training',
    price: 1999,
    countInStock: 7,
  },
  
  // Toys & Baby Products
  {
    name: 'Action Figure Set',
    imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088',
    description: 'Set of collectible action figures',
    category: 'Toys & Baby Products > Toys & Games > Action Figures & Collectibles',
    price: 1499,
    countInStock: 9,
  },
  {
    name: 'Baby Diapers Pack',
    imageUrl: 'https://images.unsplash.com/photo-1607582544956-ba15d8d2c788',
    description: 'Pack of 50 baby diapers, size 3',
    category: 'Toys & Baby Products > Baby Products > Diapers & Wipes',
    price: 899,
    countInStock: 25,
  },
  {
    name: 'Educational Puzzle',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
    description: 'Educational puzzle for children aged 3-6 years',
    category: 'Toys & Baby Products > Toys & Games > Puzzles',
    price: 699,
    countInStock: 15,
  },
  {
    name: 'Baby Crib',
    imageUrl: 'https://images.unsplash.com/photo-1586683086816-c3b0e9a0c5a8',
    description: 'Safe and comfortable baby crib',
    category: 'Toys & Baby Products > Baby Products > Baby Gear & Furniture',
    price: 7999,
    countInStock: 4,
  },
  
  // Books & Stationery
  {
    name: 'Fiction Novel',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    description: 'Bestselling fiction novel by a renowned author',
    category: 'Books & Stationery > Books > Fiction',
    price: 499,
    countInStock: 20,
  },
  {
    name: 'Notebook Set',
    imageUrl: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c',
    description: 'Set of 5 premium notebooks',
    category: 'Books & Stationery > Stationery & Office Supplies > Notebooks & Diaries',
    price: 699,
    countInStock: 30,
  },
  {
    name: 'Children\'s Storybook',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    description: 'Illustrated storybook for children',
    category: 'Books & Stationery > Books > Children\'s Books',
    price: 399,
    countInStock: 25,
  },
  {
    name: 'Art Supplies Kit',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
    description: 'Complete art supplies kit for beginners',
    category: 'Books & Stationery > Stationery & Office Supplies > Art Supplies',
    price: 1999,
    countInStock: 8,
  },
  
  // Health & Wellness
  {
    name: 'Multivitamin Tablets',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
    description: 'Daily multivitamin tablets for adults',
    category: 'Health & Wellness > Health Supplements > Vitamins & Minerals',
    price: 799,
    countInStock: 35,
  },
  {
    name: 'Digital Blood Pressure Monitor',
    imageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb',
    description: 'Accurate digital blood pressure monitor for home use',
    category: 'Health & Wellness > Medical Supplies & Equipment > Health Monitors & Devices',
    price: 2499,
    countInStock: 12,
  },
  {
    name: 'Electric Toothbrush',
    imageUrl: 'https://images.unsplash.com/photo-1559591937-eeab8c0dcc3b',
    description: 'Advanced electric toothbrush for better oral hygiene',
    category: 'Health & Wellness > Personal Care > Oral Care',
    price: 1999,
    countInStock: 10,
  },
  {
    name: 'Protein Powder',
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d',
    description: 'Whey protein powder for fitness enthusiasts',
    category: 'Health & Wellness > Health Supplements > Protein Supplements',
    price: 1799,
    countInStock: 15,
  },
  
  // Automotive
  {
    name: 'Car Phone Holder',
    imageUrl: 'https://images.unsplash.com/photo-1617886322168-72b886573c5a',
    description: 'Adjustable phone holder for car dashboard',
    category: 'Automotive > Car Accessories > Car Electronics',
    price: 699,
    countInStock: 20,
  },
  {
    name: 'Motorcycle Helmet',
    imageUrl: 'https://images.unsplash.com/photo-1591370409347-2fd43b7842d4',
    description: 'Safety helmet for motorcycle riders',
    category: 'Automotive > Motorcycle Accessories > Helmets',
    price: 2999,
    countInStock: 8,
  },
  {
    name: 'Car Cleaning Kit',
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9',
    description: 'Complete car cleaning and maintenance kit',
    category: 'Automotive > Car & Bike Care > Cleaning Kits',
    price: 1499,
    countInStock: 12,
  },
  {
    name: 'Car Seat Covers',
    imageUrl: 'https://images.unsplash.com/photo-1547731030-cd126f44e9c5',
    description: 'Set of premium car seat covers',
    category: 'Automotive > Car Accessories > Car Interior Accessories',
    price: 2499,
    countInStock: 6,
  }
];

const updateProductCategories = async () => {
  try {
    console.log('Starting product category update...');
    
    // 1. Update existing products with new category paths
    const existingProducts = await Product.find({});
    console.log(`Found ${existingProducts.length} existing products`);
    
    for (const product of existingProducts) {
      const oldCategory = product.category;
      if (categoryMapping[oldCategory]) {
        product.category = categoryMapping[oldCategory];
        await product.save();
        console.log(`Updated product: ${product.name} from "${oldCategory}" to "${product.category}"`);
      }
    }
    
    // 2. Add new products with Amazon-like categories
    console.log('\nAdding new products with Amazon-like categories...');
    const createdProducts = await Product.insertMany(newProducts);
    console.log(`Added ${createdProducts.length} new products`);
    
    console.log('\nProduct category update completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateProductCategories();
