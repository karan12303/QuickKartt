const bannerProducts = [
  {
    name: "Premium Watch",
    description: "Elegant stainless steel watch with premium craftsmanship. Features include water resistance up to 50m, sapphire crystal glass, and Japanese quartz movement.",
    price: 12999,
    category: "Fashion and Accessories > Watches",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    countInStock: 15,
    rating: 4.7,
    numReviews: 12,
    isNew: true,
    discount: 0
  },
  {
    name: "Wireless Headphones",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Includes Bluetooth 5.0 connectivity and high-resolution audio.",
    price: 8499,
    category: "Electronics > Audio",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    countInStock: 25,
    rating: 4.5,
    numReviews: 18,
    isNew: true,
    discount: 10
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for comfort and performance with durable rubber outsole for excellent traction.",
    price: 5999,
    category: "Footwear > Sports",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    countInStock: 30,
    rating: 4.6,
    numReviews: 24,
    isNew: false,
    discount: 15,
    footwearSizes: [
      { ukSize: "6", usSize: "7" },
      { ukSize: "7", usSize: "8" },
      { ukSize: "8", usSize: "9" },
      { ukSize: "9", usSize: "10" },
      { ukSize: "10", usSize: "11" }
    ]
  }
];

module.exports = bannerProducts;
