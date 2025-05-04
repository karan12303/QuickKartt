/**
 * Mock Products Data
 * 
 * This file provides fallback product data when the API is unavailable.
 * Used as a client-side fallback to ensure the application remains functional
 * even when the backend is experiencing issues.
 */

export const mockProducts = [
  {
    _id: 'mock_product_1',
    name: 'Smartphone X Pro',
    image: '/images/placeholder-product.jpg',
    description: 'Latest smartphone with advanced features and high-performance processor.',
    brand: 'TechBrand',
    category: 'Electronics > Smartphones',
    price: 49999,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_2',
    name: 'Ultra HD Smart TV',
    image: '/images/placeholder-product.jpg',
    description: '55-inch 4K Ultra HD Smart TV with HDR and built-in streaming apps.',
    brand: 'ViewTech',
    category: 'Electronics > Televisions',
    price: 59999,
    countInStock: 5,
    rating: 4.2,
    numReviews: 8,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_3',
    name: 'Wireless Noise-Cancelling Headphones',
    image: '/images/placeholder-product.jpg',
    description: 'Premium wireless headphones with active noise cancellation and long battery life.',
    brand: 'AudioPro',
    category: 'Electronics > Audio',
    price: 24999,
    countInStock: 15,
    rating: 4.7,
    numReviews: 20,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_4',
    name: 'Professional DSLR Camera',
    image: '/images/placeholder-product.jpg',
    description: 'High-resolution DSLR camera with multiple lenses and professional features.',
    brand: 'PhotoMaster',
    category: 'Electronics > Cameras',
    price: 89999,
    countInStock: 3,
    rating: 4.8,
    numReviews: 15,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_5',
    name: 'Gaming Laptop',
    image: '/images/placeholder-product.jpg',
    description: 'Powerful gaming laptop with high-performance graphics and fast processor.',
    brand: 'GameTech',
    category: 'Electronics > Computers',
    price: 129999,
    countInStock: 7,
    rating: 4.6,
    numReviews: 18,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_6',
    name: 'Smartwatch Series 5',
    image: '/images/placeholder-product.jpg',
    description: 'Advanced smartwatch with health monitoring and fitness tracking features.',
    brand: 'WearTech',
    category: 'Electronics > Wearables',
    price: 29999,
    countInStock: 12,
    rating: 4.3,
    numReviews: 10,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_7',
    name: 'Wireless Earbuds',
    image: '/images/placeholder-product.jpg',
    description: 'True wireless earbuds with premium sound quality and long battery life.',
    brand: 'AudioPro',
    category: 'Electronics > Audio',
    price: 12999,
    countInStock: 20,
    rating: 4.4,
    numReviews: 25,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_8',
    name: 'Ultra-Thin Laptop',
    image: '/images/placeholder-product.jpg',
    description: 'Lightweight and powerful laptop with all-day battery life.',
    brand: 'TechBook',
    category: 'Electronics > Computers',
    price: 79999,
    countInStock: 8,
    rating: 4.5,
    numReviews: 14,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_9',
    name: 'Smart Home Hub',
    image: '/images/placeholder-product.jpg',
    description: 'Central hub for controlling all your smart home devices.',
    brand: 'HomeSmart',
    category: 'Electronics > Smart Home',
    price: 9999,
    countInStock: 15,
    rating: 4.2,
    numReviews: 9,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_10',
    name: 'Bluetooth Speaker',
    image: '/images/placeholder-product.jpg',
    description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
    brand: 'SoundWave',
    category: 'Electronics > Audio',
    price: 7999,
    countInStock: 25,
    rating: 4.6,
    numReviews: 30,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_11',
    name: 'Fitness Tracker',
    image: '/images/placeholder-product.jpg',
    description: 'Advanced fitness tracker with heart rate monitoring and sleep tracking.',
    brand: 'FitTech',
    category: 'Electronics > Wearables',
    price: 4999,
    countInStock: 30,
    rating: 4.3,
    numReviews: 22,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock_product_12',
    name: 'Wireless Charging Pad',
    image: '/images/placeholder-product.jpg',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    brand: 'PowerUp',
    category: 'Electronics > Accessories',
    price: 2999,
    countInStock: 40,
    rating: 4.4,
    numReviews: 16,
    createdAt: new Date().toISOString()
  }
];

export default mockProducts;
