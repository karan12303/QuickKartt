require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

const addProducts = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected');
    
    // Get current product count
    const currentCount = await Product.countDocuments({});
    console.log(`Current number of products in database: ${currentCount}`);
    
    // Define new products to add
    const newProducts = [
      // ELECTRONICS - Mobiles & Accessories
      {
        name: 'Google Pixel 7 Pro',
        imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9',
        description: 'Google Pixel 7 Pro with advanced camera system, Google Tensor G2 processor, and pure Android experience.',
        category: 'Electronics > Mobiles & Accessories > Smartphones',
        price: 69999,
        countInStock: 0, // Overall count is 0, but variations have stock
        hasVariations: true,
        smartphoneSpecs: [
          {
            model: 'Pixel 7 Pro',
            storage: '128GB',
            ram: '12GB',
            countInStock: 5
          },
          {
            model: 'Pixel 7 Pro',
            storage: '256GB',
            ram: '12GB',
            countInStock: 3
          }
        ]
      },
      {
        name: 'OnePlus 11',
        imageUrl: 'https://images.unsplash.com/photo-1678911820864-e5cfd0309b4f',
        description: 'OnePlus 11 with Snapdragon 8 Gen 2, Hasselblad camera system, and 100W fast charging.',
        category: 'Electronics > Mobiles & Accessories > Smartphones',
        price: 59999,
        countInStock: 0,
        hasVariations: true,
        smartphoneSpecs: [
          {
            model: 'OnePlus 11',
            storage: '128GB',
            ram: '8GB',
            countInStock: 4
          },
          {
            model: 'OnePlus 11',
            storage: '256GB',
            ram: '16GB',
            countInStock: 3
          }
        ]
      },
      {
        name: 'Apple AirPods Pro 2',
        imageUrl: 'https://images.unsplash.com/photo-1606741965429-8cc46ac1a571',
        description: 'Apple AirPods Pro 2 with active noise cancellation, spatial audio, and adaptive transparency mode.',
        category: 'Electronics > Mobiles & Accessories > Mobile Accessories',
        price: 24999,
        countInStock: 15
      },
      {
        name: 'Samsung Galaxy Tab S9',
        imageUrl: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9',
        description: 'Samsung Galaxy Tab S9 with 11-inch AMOLED display, S Pen support, and powerful performance for productivity and entertainment.',
        category: 'Electronics > Mobiles & Accessories > Tablets',
        price: 74999,
        countInStock: 8
      },
      {
        name: 'Apple Watch Series 8',
        imageUrl: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26',
        description: 'Apple Watch Series 8 with advanced health features, always-on Retina display, and comprehensive fitness tracking.',
        category: 'Electronics > Mobiles & Accessories > Wearable Devices',
        price: 42999,
        countInStock: 12
      },
      
      // ELECTRONICS - Computers & Accessories
      {
        name: 'MacBook Air M2',
        imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9',
        description: 'MacBook Air with M2 chip, 13.6-inch Liquid Retina display, and all-day battery life in an ultraportable design.',
        category: 'Electronics > Computers & Accessories > Laptops',
        price: 114999,
        countInStock: 7
      },
      {
        name: 'HP Pavilion Gaming Desktop',
        imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5',
        description: 'HP Pavilion Gaming Desktop with Intel Core i7, NVIDIA GeForce RTX 3060, 16GB RAM, and 1TB SSD for immersive gaming experience.',
        category: 'Electronics > Computers & Accessories > Desktops',
        price: 89999,
        countInStock: 5
      },
      {
        name: 'Logitech MX Master 3S Mouse',
        imageUrl: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3',
        description: 'Logitech MX Master 3S wireless mouse with ultra-fast scrolling, ergonomic design, and precise tracking on any surface.',
        category: 'Electronics > Computers & Accessories > Computer Accessories',
        price: 9999,
        countInStock: 20
      },
      
      // ELECTRONICS - TV & Home Entertainment
      {
        name: 'Sony Bravia 65" 4K OLED TV',
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
        description: 'Sony Bravia 65" 4K OLED TV with Cognitive Processor XR, perfect blacks, and immersive sound for a premium viewing experience.',
        category: 'Electronics > TV & Home Entertainment > Televisions',
        price: 179999,
        countInStock: 4
      },
      {
        name: 'Bose Soundbar 700',
        imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d',
        description: 'Bose Soundbar 700 with spacious sound, voice assistants, and sleek design for an immersive home theater experience.',
        category: 'Electronics > TV & Home Entertainment > Home Audio Systems',
        price: 79999,
        countInStock: 6
      },
      
      // ELECTRONICS - Cameras & Photography
      {
        name: 'Canon EOS R6 Mark II',
        imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac',
        description: 'Canon EOS R6 Mark II mirrorless camera with 24.2MP sensor, 4K60p video, and advanced autofocus for professional-grade photography.',
        category: 'Electronics > Cameras & Photography > Mirrorless Cameras',
        price: 239999,
        countInStock: 3
      },
      {
        name: 'DJI Mini 3 Pro Drone',
        imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f',
        description: 'DJI Mini 3 Pro drone with 4K HDR video, 48MP photos, and advanced flight features in a compact, sub-250g design.',
        category: 'Electronics > Cameras & Photography > Camera Accessories',
        price: 89999,
        countInStock: 5
      },
      
      // ELECTRONICS - Gaming
      {
        name: 'PlayStation 5 Console',
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db',
        description: 'PlayStation 5 console with ultra-high-speed SSD, haptic feedback, adaptive triggers, and ray tracing for next-gen gaming.',
        category: 'Electronics > Gaming > Gaming Consoles',
        price: 54999,
        countInStock: 2
      },
      {
        name: 'Xbox Series X Console',
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d',
        description: 'Xbox Series X console with 4K gaming at up to 120 FPS, 1TB SSD, and backward compatibility with thousands of games.',
        category: 'Electronics > Gaming > Gaming Consoles',
        price: 49999,
        countInStock: 3
      },
      
      // FASHION - Men's Fashion
      {
        name: 'Premium Cotton Shirt',
        imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
        description: 'Premium cotton shirt with comfortable fit, breathable fabric, and classic design for formal and casual occasions.',
        category: 'Fashion > Men\'s Fashion > Clothing',
        price: 2499,
        countInStock: 25
      },
      {
        name: 'Leather Oxford Shoes',
        imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4',
        description: 'Genuine leather Oxford shoes with classic design, comfortable cushioning, and durable construction.',
        category: 'Fashion > Men\'s Fashion > Footwear',
        price: 4999,
        countInStock: 0,
        hasVariations: true,
        footwearSizes: [
          { ukSize: '7', usSize: '8', countInStock: 3 },
          { ukSize: '8', usSize: '9', countInStock: 5 },
          { ukSize: '9', usSize: '10', countInStock: 4 },
          { ukSize: '10', usSize: '11', countInStock: 3 },
          { ukSize: '11', usSize: '12', countInStock: 2 }
        ]
      },
      {
        name: 'Chronograph Watch',
        imageUrl: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0',
        description: 'Elegant chronograph watch with stainless steel case, premium leather strap, and water-resistant design.',
        category: 'Fashion > Men\'s Fashion > Watches',
        price: 12999,
        countInStock: 8
      },
      
      // FASHION - Women's Fashion
      {
        name: 'Floral Maxi Dress',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
        description: 'Elegant floral maxi dress with flowing design, comfortable fabric, and versatile style for various occasions.',
        category: 'Fashion > Women\'s Fashion > Clothing',
        price: 3499,
        countInStock: 15
      },
      {
        name: 'Designer Stiletto Heels',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
        description: 'Designer stiletto heels with elegant design, comfortable padding, and premium materials for special occasions.',
        category: 'Fashion > Women\'s Fashion > Footwear',
        price: 5999,
        countInStock: 0,
        hasVariations: true,
        footwearSizes: [
          { ukSize: '4', usSize: '6', countInStock: 2 },
          { ukSize: '5', usSize: '7', countInStock: 4 },
          { ukSize: '6', usSize: '8', countInStock: 3 },
          { ukSize: '7', usSize: '9', countInStock: 2 }
        ]
      },
      {
        name: 'Leather Tote Bag',
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
        description: 'Premium leather tote bag with spacious interior, multiple compartments, and elegant design for everyday use.',
        category: 'Fashion > Women\'s Fashion > Handbags & Clutches',
        price: 7999,
        countInStock: 10
      },
      
      // HOME & KITCHEN - Kitchen & Dining
      {
        name: 'Non-Stick Cookware Set',
        imageUrl: 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783',
        description: 'Premium non-stick cookware set with durable construction, even heat distribution, and ergonomic handles for everyday cooking.',
        category: 'Home & Kitchen > Kitchen & Dining > Cookware',
        price: 8999,
        countInStock: 7
      },
      {
        name: 'Premium Knife Set',
        imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546',
        description: 'Professional-grade knife set with high-carbon stainless steel blades, ergonomic handles, and wooden storage block.',
        category: 'Home & Kitchen > Kitchen & Dining > Kitchen Tools & Utensils',
        price: 12999,
        countInStock: 5
      },
      
      // HOME & KITCHEN - Home Appliances
      {
        name: 'Samsung Double Door Refrigerator',
        imageUrl: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30',
        description: 'Samsung double door refrigerator with digital inverter technology, frost-free operation, and energy-efficient cooling.',
        category: 'Home & Kitchen > Home Appliances > Refrigerators',
        price: 42999,
        countInStock: 3
      },
      {
        name: 'Bosch Front Load Washing Machine',
        imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1a6f4708',
        description: 'Bosch front load washing machine with 8kg capacity, multiple wash programs, and energy-efficient operation.',
        category: 'Home & Kitchen > Home Appliances > Washing Machines',
        price: 39999,
        countInStock: 4
      },
      
      // HOME & KITCHEN - Furniture
      {
        name: 'L-Shaped Sofa Set',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
        description: 'Modern L-shaped sofa set with premium upholstery, comfortable cushioning, and elegant design for your living room.',
        category: 'Home & Kitchen > Furniture > Living Room Furniture',
        price: 49999,
        countInStock: 2
      },
      {
        name: 'Queen Size Bed Frame',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
        description: 'Elegant queen size bed frame with solid wood construction, modern design, and durable finish.',
        category: 'Home & Kitchen > Furniture > Bedroom Furniture',
        price: 24999,
        countInStock: 3
      },
      
      // BEAUTY & PERSONAL CARE - Makeup
      {
        name: 'Luxury Makeup Palette',
        imageUrl: 'https://images.unsplash.com/photo-1596704017254-9a89b0a9f184',
        description: 'Luxury eyeshadow palette with 18 highly pigmented shades, smooth application, and long-lasting formula.',
        category: 'Beauty & Personal Care > Makeup > Eye Makeup',
        price: 4999,
        countInStock: 12
      },
      {
        name: 'Premium Lipstick Collection',
        imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa',
        description: 'Premium lipstick collection with 5 versatile shades, creamy texture, and long-lasting color.',
        category: 'Beauty & Personal Care > Makeup > Lip Makeup',
        price: 3499,
        countInStock: 15
      },
      
      // BEAUTY & PERSONAL CARE - Skincare
      {
        name: 'Advanced Anti-Aging Serum',
        imageUrl: 'https://images.unsplash.com/photo-1556229010-aa3f7ff66b24',
        description: 'Advanced anti-aging serum with hyaluronic acid, vitamin C, and peptides for youthful, radiant skin.',
        category: 'Beauty & Personal Care > Skincare > Face Care',
        price: 5999,
        countInStock: 20
      },
      {
        name: 'Luxury Body Care Set',
        imageUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4a8e9ae',
        description: 'Luxury body care set with body wash, lotion, and scrub infused with natural ingredients and essential oils.',
        category: 'Beauty & Personal Care > Skincare > Body Care',
        price: 4499,
        countInStock: 8
      },
      
      // GROCERY & GOURMET FOODS - Packaged Foods
      {
        name: 'Gourmet Snack Box',
        imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60',
        description: 'Curated gourmet snack box with premium nuts, dried fruits, chocolates, and savory treats for any occasion.',
        category: 'Grocery & Gourmet Foods > Packaged Foods > Snacks & Chips',
        price: 1999,
        countInStock: 25
      },
      {
        name: 'Organic Breakfast Cereal',
        imageUrl: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c',
        description: 'Organic breakfast cereal with whole grains, nuts, and dried fruits for a nutritious start to your day.',
        category: 'Grocery & Gourmet Foods > Packaged Foods > Breakfast Foods',
        price: 699,
        countInStock: 30
      },
      
      // GROCERY & GOURMET FOODS - Beverages
      {
        name: 'Premium Tea Collection',
        imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
        description: 'Premium tea collection with 6 varieties of loose-leaf teas from around the world in elegant packaging.',
        category: 'Grocery & Gourmet Foods > Beverages > Tea',
        price: 1499,
        countInStock: 15
      },
      {
        name: 'Specialty Coffee Beans',
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
        description: 'Single-origin specialty coffee beans, ethically sourced and freshly roasted for exceptional flavor.',
        category: 'Grocery & Gourmet Foods > Beverages > Coffee',
        price: 999,
        countInStock: 20
      },
      
      // SPORTS & FITNESS - Exercise & Fitness
      {
        name: 'Smart Fitness Watch',
        imageUrl: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558',
        description: 'Smart fitness watch with heart rate monitoring, GPS tracking, sleep analysis, and multiple sport modes.',
        category: 'Sports & Fitness > Exercise & Fitness > Fitness Accessories',
        price: 14999,
        countInStock: 10
      },
      {
        name: 'Adjustable Dumbbell Set',
        imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2',
        description: 'Adjustable dumbbell set with quick weight change mechanism, compact design, and durable construction.',
        category: 'Sports & Fitness > Exercise & Fitness > Strength Training',
        price: 19999,
        countInStock: 5
      },
      
      // SPORTS & FITNESS - Outdoor Sports
      {
        name: 'Professional Cricket Bat',
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
        description: 'Professional-grade cricket bat made from premium English willow with optimal weight balance and excellent pickup.',
        category: 'Sports & Fitness > Outdoor Sports > Cricket',
        price: 12999,
        countInStock: 8
      },
      {
        name: 'Mountain Bike',
        imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91',
        description: 'High-performance mountain bike with lightweight aluminum frame, 27-speed gearing, and hydraulic disc brakes.',
        category: 'Sports & Fitness > Outdoor Sports > Cycling',
        price: 34999,
        countInStock: 3
      },
      
      // TOYS & BABY PRODUCTS - Toys & Games
      {
        name: 'Educational Building Blocks',
        imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
        description: 'Educational building blocks set with 250+ pieces for creative play and cognitive development for ages 3+.',
        category: 'Toys & Baby Products > Toys & Games > Educational Toys',
        price: 2499,
        countInStock: 15
      },
      {
        name: 'Strategy Board Game',
        imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
        description: 'Engaging strategy board game for 2-6 players with unique mechanics and high replay value for ages 10+.',
        category: 'Toys & Baby Products > Toys & Games > Board Games',
        price: 3499,
        countInStock: 10
      },
      
      // TOYS & BABY PRODUCTS - Baby Products
      {
        name: 'Premium Baby Stroller',
        imageUrl: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa',
        description: 'Premium baby stroller with adjustable seating positions, all-terrain wheels, and compact folding design.',
        category: 'Toys & Baby Products > Baby Products > Baby Gear & Furniture',
        price: 24999,
        countInStock: 5
      },
      {
        name: 'Baby Care Essentials Kit',
        imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f',
        description: 'Complete baby care essentials kit with gentle shampoo, lotion, oil, powder, and wipes for sensitive skin.',
        category: 'Toys & Baby Products > Baby Products > Baby Care & Grooming',
        price: 1999,
        countInStock: 12
      },
      
      // BOOKS & STATIONERY - Books
      {
        name: 'Bestselling Fiction Collection',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
        description: 'Collection of 5 bestselling fiction novels from acclaimed authors, perfect for avid readers.',
        category: 'Books & Stationery > Books > Fiction',
        price: 3999,
        countInStock: 8
      },
      {
        name: 'Business Leadership Book',
        imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73',
        description: 'Comprehensive business leadership book with practical strategies, case studies, and actionable insights.',
        category: 'Books & Stationery > Books > Non-Fiction',
        price: 1499,
        countInStock: 15
      },
      
      // BOOKS & STATIONERY - Stationery
      {
        name: 'Premium Fountain Pen',
        imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd',
        description: 'Premium fountain pen with smooth writing experience, elegant design, and durable construction.',
        category: 'Books & Stationery > Stationery & Office Supplies > Writing Supplies',
        price: 4999,
        countInStock: 10
      },
      {
        name: 'Professional Art Supply Set',
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
        description: 'Professional art supply set with 48 colored pencils, 24 watercolors, and 12 acrylic paints in a wooden case.',
        category: 'Books & Stationery > Stationery & Office Supplies > Art Supplies',
        price: 3999,
        countInStock: 7
      },
      
      // HEALTH & WELLNESS - Health Supplements
      {
        name: 'Multivitamin & Mineral Complex',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
        description: 'Comprehensive multivitamin and mineral complex with 25 essential nutrients for overall health and wellbeing.',
        category: 'Health & Wellness > Health Supplements > Vitamins & Minerals',
        price: 1299,
        countInStock: 25
      },
      {
        name: 'Whey Protein Isolate',
        imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d',
        description: 'Premium whey protein isolate with 25g protein per serving, low carbs, and great taste for muscle recovery.',
        category: 'Health & Wellness > Health Supplements > Protein Supplements',
        price: 2999,
        countInStock: 15
      },
      
      // AUTOMOTIVE - Car Accessories
      {
        name: 'Car Dash Camera',
        imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
        description: '4K car dash camera with wide-angle lens, night vision, GPS tracking, and parking monitoring for driving safety.',
        category: 'Automotive > Car Accessories > Car Electronics',
        price: 8999,
        countInStock: 8
      },
      {
        name: 'Premium Car Seat Covers',
        imageUrl: 'https://images.unsplash.com/photo-1547731030-cd126f44e9c5',
        description: 'Premium car seat covers with durable materials, comfortable padding, and universal fit for most vehicles.',
        category: 'Automotive > Car Accessories > Car Interior Accessories',
        price: 4999,
        countInStock: 10
      }
    ];
    
    // Insert products into database
    const createdProducts = await Product.insertMany(newProducts);
    
    // Get updated product count
    const updatedCount = await Product.countDocuments({});
    
    console.log(`Added ${createdProducts.length} new products`);
    console.log(`Total products in database: ${updatedCount}`);
    
    console.log('Products added successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

addProducts();
