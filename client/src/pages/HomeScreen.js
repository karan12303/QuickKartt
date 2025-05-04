import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, Toast, ToastContainer, Pagination, Button } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
import AnimatedProductCard from '../components/AnimatedProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Message from '../components/Message';
import ProductFilter from '../components/ProductFilter';
import FuturisticHero from '../components/FuturisticHero';
import { staggerContainer, fadeIn } from '../utils/animations';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

// Import mock data for fallback
import { mockProducts } from '../data/mockProducts';

const HomeScreen = () => {
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // State to track if we're using fallback data
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setUsingFallback(false);

        // Fetch all products by setting a high limit
        const { data } = await axios.get('/api/products', {
          params: {
            limit: 1000, // Fetch all products (up to 1000)
            page: 1,
            sort: 'createdAt',
            order: 'desc'
          },
          timeout: 15000 // Increased timeout to 15 seconds for loading more products
        });

        // Add a small delay to allow for UI rendering
        setTimeout(() => {
          // Check if data has products property (new API format)
          const productList = data.products || data;
          setProducts(productList);
          setFilteredProducts(productList);
          setLoading(false);
        }, 100);
      } catch (error) {
        console.error('Error fetching products:', error);

        // Use mock data as fallback
        console.log('Using mock data as fallback');
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setUsingFallback(true);
        setError(null); // Clear error since we're using fallback data
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to retry loading products from the API
  const handleRetryFetch = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products from API
      const { data } = await axios.get('/api/products', {
        params: {
          limit: 1000,
          page: 1,
          sort: 'createdAt',
          order: 'desc'
        },
        timeout: 15000
      });

      // Update state with fetched products
      const productList = data.products || data;
      setProducts(productList);
      setFilteredProducts(productList);
      setUsingFallback(false);
      setLoading(false);

      // Show success toast
      setToastMessage('Products loaded successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Error retrying product fetch:', error);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to load products from server. Using fallback data.'
      );
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const applyFilters = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => {
        // Check if product category contains the selected category at any level
        if (product.category.includes(selectedCategory)) {
          return true;
        }

        // Check if the selected category is a path
        if (selectedCategory.includes('>')) {
          const categoryParts = selectedCategory.split('>').map(part => part.trim());

          // Check if product category matches any part of the path
          for (const part of categoryParts) {
            if (product.category.includes(part)) {
              return true;
            }
          }

          // Check if product category is a more specific version of the selected category
          const mostSpecificCategory = categoryParts[categoryParts.length - 1];
          if (product.category.includes(mostSpecificCategory)) {
            return true;
          }
        }

        return false;
      });
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min &&
      product.price <= priceRange.max
    );

    // Apply sorting
    if (sortOrder) {
      switch (sortOrder) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);

    // Calculate total pages
    const calculatedTotalPages = Math.ceil(filtered.length / productsPerPage);
    setTotalPages(calculatedTotalPages);

    // Reset to first page when filters change
    setCurrentPage(1);

    // Update paginated products
    updatePaginatedProducts(filtered, 1);
  };

  // Update paginated products based on current page
  const updatePaginatedProducts = (products, page) => {
    const indexOfLastProduct = page * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    setPaginatedProducts(currentProducts);
  };

  // Apply filters only when the Apply Filters button is clicked
  // This prevents automatic filtering on every price range change
  useEffect(() => {
    // Only apply filters when products change (initial load)
    // or when category/sort order changes
    if (products.length > 0) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortOrder, products]);

  // Handle page changes
  useEffect(() => {
    if (filteredProducts.length > 0 && currentPage > 0) {
      updatePaginatedProducts(filteredProducts, currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filteredProducts]);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of products section
    document.querySelector('.products-container').scrollIntoView({ behavior: 'smooth' });
  };

  // Function to add product to cart
  const handleAddToCart = (product) => {
    try {
      // Add product to cart with quantity 1
      addToCart(product._id, 1);

      // Show success toast
      setToastMessage(`${product.name} added to cart!`);
      setShowToast(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToastMessage('Failed to add product to cart');
      setShowToast(true);
    }
  };

  // Function to handle wishlist
  const handleAddToWishlist = (product) => {
    try {
      if (!userInfo) {
        // Redirect to login if not logged in
        window.location.href = '/login';
        return;
      }

      // Show success toast
      setToastMessage(`${product.name} added to wishlist!`);
      setShowToast(true);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setToastMessage('Failed to add product to wishlist');
      setShowToast(true);
    }
  };

  // Function to handle compare
  const handleAddToCompare = (product) => {
    try {
      // Show success toast
      setToastMessage(`${product.name} added to compare!`);
      setShowToast(true);
    } catch (error) {
      console.error('Error adding to compare:', error);
      setToastMessage('Failed to add product to compare');
      setShowToast(true);
    }
  };

  return (
    <>
      {/* Toast notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
          className="text-white"
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">QuickKart</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Futuristic Hero Section */}
      <FuturisticHero />

      {/* Main Products Section */}
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="my-5"
        >
          <h2 className="section-title mb-4 display-text text-gradient-primary">Discover Our Products</h2>
        </motion.div>

        {error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row>
            {/* Filter Column */}
            <Col md={3} className="mb-4">
              <motion.div
                className="filter-sidebar p-4 rounded-lg glass"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h4 className="mb-3 border-bottom pb-2 text-gradient-secondary">Filter Products</h4>
                <ProductFilter
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  applyFilters={applyFilters}
                />

                {/* Filter Summary */}
                {(selectedCategory || sortOrder || priceRange.min > 0 || priceRange.max < 1000000) && (
                  <motion.div
                    className="mt-4 p-3 bg-light rounded glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h6 className="mb-2 text-gradient-primary">Active Filters:</h6>
                    <ul className="list-unstyled mb-0">
                      {selectedCategory && (
                        <li className="mb-1"><small>Category: <strong>{selectedCategory}</strong></small></li>
                      )}
                      {sortOrder && (
                        <li className="mb-1">
                          <small>
                            Sort: <strong>
                              {sortOrder === 'price_asc' ? 'Price: Low to High' :
                              sortOrder === 'price_desc' ? 'Price: High to Low' :
                              'Newest First'}
                            </strong>
                          </small>
                        </li>
                      )}
                      {(priceRange.min > 0 || priceRange.max < 1000000) && (
                        <li><small>Price: <strong>₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()}</strong></small></li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            </Col>

            {/* Products Column */}
            <Col md={9}>
              <motion.div
                className="products-container p-4 rounded-lg glass"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <motion.h5
                    className="mb-0 text-gradient-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {loading ? 'Loading products...' :
                      `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Product' : 'Products'} Found`}
                  </motion.h5>
                  <motion.div
                    className="sort-options"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <select
                      className="form-select form-select-sm glass"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="">Sort By</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </motion.div>
                </div>

                {/* Fallback data notification */}
                {usingFallback && !loading && (
                  <motion.div
                    className="alert alert-warning mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Using demo products.</strong> Unable to connect to the server.
                        You're viewing sample product data.
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleRetryFetch}
                        className="ms-3"
                      >
                        Retry
                      </Button>
                    </div>
                  </motion.div>
                )}

                {loading ? (
                  <SkeletonLoader count={12} />
                ) : filteredProducts.length === 0 ? (
                  <Message>No products found matching your criteria. Try adjusting your filters.</Message>
                ) : (
                  <>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="products-container"
                    >
                      <Row className="g-4 product-grid">
                        {paginatedProducts.map((product, index) => (
                          <Col key={product._id} sm={12} md={6} lg={4} className="mb-4 product-column">
                            {/* Using React.memo internally in AnimatedProductCard for better performance with many products */}
                            <AnimatedProductCard
                              product={product}
                              addToCart={handleAddToCart}
                              addToWishlist={handleAddToWishlist}
                              addToCompare={handleAddToCompare}
                            />
                          </Col>
                        ))}
                      </Row>
                    </motion.div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <motion.div
                        className="d-flex justify-content-center mt-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Pagination className="pagination-custom">
                          <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                          />
                          <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          />

                          {/* Show page numbers with ellipsis for large page counts */}
                          {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNumber = index + 1;

                            // Always show first page, last page, current page, and pages around current page
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                              return (
                                <Pagination.Item
                                  key={pageNumber}
                                  active={pageNumber === currentPage}
                                  onClick={() => handlePageChange(pageNumber)}
                                >
                                  {pageNumber}
                                </Pagination.Item>
                              );
                            }

                            // Show ellipsis for gaps
                            if (
                              (pageNumber === 2 && currentPage > 3) ||
                              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                              return <Pagination.Ellipsis key={pageNumber} />;
                            }

                            return null;
                          })}

                          <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          />
                          <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                          />
                        </Pagination>
                      </motion.div>
                    )}

                    {/* Page info */}
                    <motion.div
                      className="text-center mt-3 text-muted"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <small>
                        Showing {paginatedProducts.length} of {filteredProducts.length} products | Page {currentPage} of {totalPages}
                      </small>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
