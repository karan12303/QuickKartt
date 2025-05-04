// Amazon-like categories for QuickKart
const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png',
    subcategories: [
      {
        id: 'mobiles',
        name: 'Mobiles & Accessories',
        subcategories: [
          { id: 'smartphones', name: 'Smartphones' },
          { id: 'mobile-accessories', name: 'Mobile Accessories' },
          { id: 'tablets', name: 'Tablets' },
          { id: 'wearable-devices', name: 'Wearable Devices' }
        ]
      },
      {
        id: 'computers',
        name: 'Computers & Accessories',
        subcategories: [
          { id: 'laptops', name: 'Laptops' },
          { id: 'desktops', name: 'Desktops' },
          { id: 'computer-accessories', name: 'Computer Accessories' },
          { id: 'computer-components', name: 'Computer Components' },
          { id: 'storage-devices', name: 'Storage Devices' }
        ]
      },
      {
        id: 'tv-appliances',
        name: 'TV & Home Entertainment',
        subcategories: [
          { id: 'televisions', name: 'Televisions' },
          { id: 'home-audio', name: 'Home Audio Systems' },
          { id: 'headphones', name: 'Headphones & Earphones' },
          { id: 'speakers', name: 'Speakers' }
        ]
      },
      {
        id: 'cameras',
        name: 'Cameras & Photography',
        subcategories: [
          { id: 'dslr-cameras', name: 'DSLR Cameras' },
          { id: 'mirrorless-cameras', name: 'Mirrorless Cameras' },
          { id: 'point-shoot-cameras', name: 'Point & Shoot Cameras' },
          { id: 'camera-accessories', name: 'Camera Accessories' }
        ]
      },
      {
        id: 'gaming',
        name: 'Gaming',
        subcategories: [
          { id: 'gaming-consoles', name: 'Gaming Consoles' },
          { id: 'games', name: 'Video Games' },
          { id: 'gaming-accessories', name: 'Gaming Accessories' }
        ]
      }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png',
    subcategories: [
      {
        id: 'mens-fashion',
        name: 'Men\'s Fashion',
        subcategories: [
          { id: 'mens-clothing', name: 'Clothing' },
          { id: 'mens-footwear', name: 'Footwear' },
          { id: 'mens-watches', name: 'Watches' },
          { id: 'mens-accessories', name: 'Accessories' }
        ]
      },
      {
        id: 'womens-fashion',
        name: 'Women\'s Fashion',
        subcategories: [
          { id: 'womens-clothing', name: 'Clothing' },
          { id: 'womens-footwear', name: 'Footwear' },
          { id: 'womens-watches', name: 'Watches' },
          { id: 'womens-handbags', name: 'Handbags & Clutches' },
          { id: 'womens-accessories', name: 'Accessories' }
        ]
      },
      {
        id: 'kids-fashion',
        name: 'Kids\' Fashion',
        subcategories: [
          { id: 'boys-clothing', name: 'Boys\' Clothing' },
          { id: 'girls-clothing', name: 'Girls\' Clothing' },
          { id: 'kids-footwear', name: 'Kids\' Footwear' },
          { id: 'school-supplies', name: 'School Supplies' }
        ]
      },
      {
        id: 'luggage',
        name: 'Luggage & Bags',
        subcategories: [
          { id: 'backpacks', name: 'Backpacks' },
          { id: 'suitcases', name: 'Suitcases & Trolleys' },
          { id: 'travel-accessories', name: 'Travel Accessories' }
        ]
      }
    ]
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png',
    subcategories: [
      {
        id: 'kitchen-dining',
        name: 'Kitchen & Dining',
        subcategories: [
          { id: 'cookware', name: 'Cookware' },
          { id: 'kitchen-tools', name: 'Kitchen Tools & Utensils' },
          { id: 'tableware', name: 'Tableware & Dinnerware' },
          { id: 'kitchen-storage', name: 'Kitchen Storage' }
        ]
      },
      {
        id: 'home-appliances',
        name: 'Home Appliances',
        subcategories: [
          { id: 'refrigerators', name: 'Refrigerators' },
          { id: 'washing-machines', name: 'Washing Machines' },
          { id: 'air-conditioners', name: 'Air Conditioners' },
          { id: 'microwave-ovens', name: 'Microwave Ovens' },
          { id: 'small-appliances', name: 'Small Appliances' }
        ]
      },
      {
        id: 'furniture',
        name: 'Furniture',
        subcategories: [
          { id: 'living-room', name: 'Living Room Furniture' },
          { id: 'bedroom', name: 'Bedroom Furniture' },
          { id: 'dining-room', name: 'Dining Room Furniture' },
          { id: 'office-furniture', name: 'Office Furniture' }
        ]
      },
      {
        id: 'home-decor',
        name: 'Home Décor',
        subcategories: [
          { id: 'wall-decor', name: 'Wall Décor' },
          { id: 'lighting', name: 'Lighting' },
          { id: 'cushions-covers', name: 'Cushions & Covers' },
          { id: 'home-furnishing', name: 'Home Furnishing' }
        ]
      }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    icon: 'https://cdn-icons-png.flaticon.com/512/1005/1005769.png',
    subcategories: [
      {
        id: 'makeup',
        name: 'Makeup',
        subcategories: [
          { id: 'face-makeup', name: 'Face Makeup' },
          { id: 'eye-makeup', name: 'Eye Makeup' },
          { id: 'lip-makeup', name: 'Lip Makeup' },
          { id: 'makeup-sets', name: 'Makeup Sets & Kits' }
        ]
      },
      {
        id: 'skincare',
        name: 'Skincare',
        subcategories: [
          { id: 'face-care', name: 'Face Care' },
          { id: 'body-care', name: 'Body Care' },
          { id: 'hand-foot-care', name: 'Hand & Foot Care' },
          { id: 'skincare-kits', name: 'Skincare Kits' }
        ]
      },
      {
        id: 'haircare',
        name: 'Haircare',
        subcategories: [
          { id: 'shampoo-conditioner', name: 'Shampoo & Conditioner' },
          { id: 'hair-styling', name: 'Hair Styling & Treatments' },
          { id: 'hair-accessories', name: 'Hair Accessories' }
        ]
      },
      {
        id: 'fragrances',
        name: 'Fragrances',
        subcategories: [
          { id: 'mens-fragrances', name: 'Men\'s Fragrances' },
          { id: 'womens-fragrances', name: 'Women\'s Fragrances' },
          { id: 'gift-sets', name: 'Gift Sets' }
        ]
      }
    ]
  },
  {
    id: 'grocery',
    name: 'Grocery & Gourmet Foods',
    icon: 'https://cdn-icons-png.flaticon.com/512/3724/3724763.png',
    subcategories: [
      {
        id: 'packaged-foods',
        name: 'Packaged Foods',
        subcategories: [
          { id: 'snacks', name: 'Snacks & Chips' },
          { id: 'breakfast-foods', name: 'Breakfast Foods' },
          { id: 'noodles-pasta', name: 'Noodles & Pasta' },
          { id: 'ready-to-eat', name: 'Ready to Eat' }
        ]
      },
      {
        id: 'beverages',
        name: 'Beverages',
        subcategories: [
          { id: 'tea', name: 'Tea' },
          { id: 'coffee', name: 'Coffee' },
          { id: 'juices', name: 'Juices & Drinks' },
          { id: 'water', name: 'Water' }
        ]
      },
      {
        id: 'staples',
        name: 'Staples',
        subcategories: [
          { id: 'rice-flour', name: 'Rice & Flour' },
          { id: 'dals-pulses', name: 'Dals & Pulses' },
          { id: 'spices', name: 'Spices & Masalas' },
          { id: 'oils', name: 'Oils & Ghee' }
        ]
      },
      {
        id: 'gourmet-foods',
        name: 'Gourmet Foods',
        subcategories: [
          { id: 'chocolates', name: 'Chocolates & Desserts' },
          { id: 'cheese', name: 'Cheese & Gourmet Dairy' },
          { id: 'sauces-spreads', name: 'Sauces & Spreads' }
        ]
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    icon: 'https://cdn-icons-png.flaticon.com/512/2833/2833315.png',
    subcategories: [
      {
        id: 'exercise-fitness',
        name: 'Exercise & Fitness',
        subcategories: [
          { id: 'cardio-equipment', name: 'Cardio Equipment' },
          { id: 'strength-training', name: 'Strength Training' },
          { id: 'fitness-accessories', name: 'Fitness Accessories' },
          { id: 'yoga', name: 'Yoga' }
        ]
      },
      {
        id: 'outdoor-sports',
        name: 'Outdoor Sports',
        subcategories: [
          { id: 'cricket', name: 'Cricket' },
          { id: 'football', name: 'Football' },
          { id: 'badminton', name: 'Badminton' },
          { id: 'cycling', name: 'Cycling' }
        ]
      },
      {
        id: 'sportswear',
        name: 'Sportswear',
        subcategories: [
          { id: 'mens-sportswear', name: 'Men\'s Sportswear' },
          { id: 'womens-sportswear', name: 'Women\'s Sportswear' },
          { id: 'sports-footwear', name: 'Sports Footwear' }
        ]
      }
    ]
  },
  {
    id: 'toys-baby',
    name: 'Toys & Baby Products',
    icon: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png',
    subcategories: [
      {
        id: 'toys-games',
        name: 'Toys & Games',
        subcategories: [
          { id: 'action-figures', name: 'Action Figures & Collectibles' },
          { id: 'dolls', name: 'Dolls & Accessories' },
          { id: 'board-games', name: 'Board Games' },
          { id: 'puzzles', name: 'Puzzles' },
          { id: 'educational-toys', name: 'Educational Toys' }
        ]
      },
      {
        id: 'baby-products',
        name: 'Baby Products',
        subcategories: [
          { id: 'diapers-wipes', name: 'Diapers & Wipes' },
          { id: 'baby-food', name: 'Baby Food & Formula' },
          { id: 'baby-care', name: 'Baby Care & Grooming' },
          { id: 'baby-gear', name: 'Baby Gear & Furniture' }
        ]
      }
    ]
  },
  {
    id: 'books',
    name: 'Books & Stationery',
    icon: 'https://cdn-icons-png.flaticon.com/512/2702/2702134.png',
    subcategories: [
      {
        id: 'books',
        name: 'Books',
        subcategories: [
          { id: 'fiction', name: 'Fiction' },
          { id: 'non-fiction', name: 'Non-Fiction' },
          { id: 'academic', name: 'Academic & Professional' },
          { id: 'children-books', name: 'Children\'s Books' }
        ]
      },
      {
        id: 'stationery',
        name: 'Stationery & Office Supplies',
        subcategories: [
          { id: 'writing-supplies', name: 'Writing Supplies' },
          { id: 'notebooks-diaries', name: 'Notebooks & Diaries' },
          { id: 'office-supplies', name: 'Office Supplies' },
          { id: 'art-supplies', name: 'Art Supplies' }
        ]
      }
    ]
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
    subcategories: [
      {
        id: 'health-supplements',
        name: 'Health Supplements',
        subcategories: [
          { id: 'vitamins-minerals', name: 'Vitamins & Minerals' },
          { id: 'protein-supplements', name: 'Protein Supplements' },
          { id: 'ayurveda', name: 'Ayurveda Products' }
        ]
      },
      {
        id: 'medical-supplies',
        name: 'Medical Supplies & Equipment',
        subcategories: [
          { id: 'health-monitors', name: 'Health Monitors & Devices' },
          { id: 'first-aid', name: 'First Aid' },
          { id: 'elderly-care', name: 'Elderly Care' }
        ]
      },
      {
        id: 'personal-care',
        name: 'Personal Care',
        subcategories: [
          { id: 'oral-care', name: 'Oral Care' },
          { id: 'feminine-hygiene', name: 'Feminine Hygiene' },
          { id: 'men-grooming', name: 'Men\'s Grooming' }
        ]
      }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: 'https://cdn-icons-png.flaticon.com/512/741/741407.png',
    subcategories: [
      {
        id: 'car-accessories',
        name: 'Car Accessories',
        subcategories: [
          { id: 'car-electronics', name: 'Car Electronics' },
          { id: 'car-interior', name: 'Car Interior Accessories' },
          { id: 'car-exterior', name: 'Car Exterior Accessories' }
        ]
      },
      {
        id: 'bike-accessories',
        name: 'Motorcycle Accessories',
        subcategories: [
          { id: 'helmets', name: 'Helmets' },
          { id: 'bike-parts', name: 'Bike Parts & Accessories' },
          { id: 'riding-gear', name: 'Riding Gear' }
        ]
      },
      {
        id: 'car-care',
        name: 'Car & Bike Care',
        subcategories: [
          { id: 'cleaning-kits', name: 'Cleaning Kits' },
          { id: 'polishes-waxes', name: 'Polishes & Waxes' },
          { id: 'oils-fluids', name: 'Oils & Fluids' }
        ]
      }
    ]
  }
];

// Flatten categories for search and filtering
const flattenCategories = (categories) => {
  let flatCategories = [];
  
  categories.forEach(category => {
    // Add main category
    flatCategories.push({
      id: category.id,
      name: category.name,
      path: category.name
    });
    
    // Add subcategories
    if (category.subcategories) {
      category.subcategories.forEach(subcat => {
        flatCategories.push({
          id: subcat.id,
          name: subcat.name,
          path: `${category.name} > ${subcat.name}`
        });
        
        // Add sub-subcategories
        if (subcat.subcategories) {
          subcat.subcategories.forEach(subsubcat => {
            flatCategories.push({
              id: subsubcat.id,
              name: subsubcat.name,
              path: `${category.name} > ${subcat.name} > ${subsubcat.name}`
            });
          });
        }
      });
    }
  });
  
  return flatCategories;
};

const flatCategories = flattenCategories(categories);

export { categories, flatCategories };
