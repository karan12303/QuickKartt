// Mock data for when the database is not available

const mockProducts = [
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 2999,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'SoundMaster',
    imageUrl: 'https://via.placeholder.com/300',
    countInStock: 15,
    rating: 4.5,
    numReviews: 12,
    colors: ['Black', 'White', 'Blue'],
    featured: true
  },
  {
    _id: '2',
    name: 'Smartphone Pro Max',
    description: 'Latest smartphone with advanced camera and long battery life',
    price: 49999,
    category: 'Electronics',
    subcategory: 'Phones',
    brand: 'TechGiant',
    imageUrl: 'https://via.placeholder.com/300',
    countInStock: 7,
    rating: 4.8,
    numReviews: 24,
    colors: ['Black', 'Silver', 'Gold'],
    featured: true
  },
  {
    _id: '3',
    name: 'Running Shoes',
    description: 'Comfortable running shoes with excellent support',
    price: 3499,
    category: 'Fashion',
    subcategory: 'Footwear',
    brand: 'SportElite',
    imageUrl: 'https://via.placeholder.com/300',
    countInStock: 20,
    rating: 4.2,
    numReviews: 8,
    colors: ['Black', 'Blue', 'Red'],
    featured: false
  },
  {
    _id: '4',
    name: 'Smart Watch',
    description: 'Fitness tracker and smartwatch with heart rate monitor',
    price: 8999,
    category: 'Electronics',
    subcategory: 'Wearables',
    brand: 'FitTech',
    imageUrl: 'https://via.placeholder.com/300',
    countInStock: 11,
    rating: 4.6,
    numReviews: 15,
    colors: ['Black', 'Silver'],
    featured: true
  },
  {
    _id: '5',
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 79999,
    category: 'Electronics',
    subcategory: 'Computers',
    brand: 'TechGiant',
    imageUrl: 'https://via.placeholder.com/300',
    countInStock: 5,
    rating: 4.9,
    numReviews: 18,
    colors: ['Silver', 'Space Gray'],
    featured: true
  },
  {
    _id: '6',
    name: 'Designer Handbag',
    description: 'Elegant designer handbag made from premium materials',
    price: 12999,
    category: 'Fashion',
    subcategory: 'Accessories',
    brand: 'LuxuryStyle',
    imageUrl: 'https://via.placeholder.com/300',
    countInStock: 8,
    rating: 4.7,
    numReviews: 9,
    colors: ['Black', 'Brown', 'Red'],
    featured: false
  }
];

const mockBannerSettings = [
  {
    _id: '1',
    productId: mockProducts[0],
    title: 'Premium Audio',
    subtitle: 'Experience crystal clear sound with our wireless headphones',
    color: 'primary',
    isActive: true,
    order: 1
  },
  {
    _id: '2',
    productId: mockProducts[1],
    title: 'Latest Smartphone',
    subtitle: 'Capture every moment with our advanced camera technology',
    color: 'secondary',
    isActive: true,
    order: 2
  },
  {
    _id: '3',
    productId: mockProducts[4],
    title: 'Professional Computing',
    subtitle: 'Power and performance for demanding tasks',
    color: 'primary',
    isActive: true,
    order: 3
  }
];

module.exports = {
  mockProducts,
  mockBannerSettings
};
