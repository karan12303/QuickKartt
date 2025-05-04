import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight, FaShoppingCart } from 'react-icons/fa';
import { categories } from '../data/categories';

const HeroSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // Get 3 random products for the featured section
        const randomProducts = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setFeaturedProducts(randomProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="hero-section mb-5">
      <Container fluid className="p-0">
        <Row className="g-0">
          {/* Main Hero Banner */}
          <Col lg={8} className="hero-main">
            <div className="hero-content position-relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Hero Banner"
                className="hero-image w-100"
                style={{ height: '500px', objectFit: 'cover' }}
              />
              <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
                   style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }}>
                <Container>
                  <Row>
                    <Col md={10} lg={8}>
                      <div className="hero-text text-white p-4">
                        <h1 className="display-4 fw-bold mb-3">Summer Collection 2025</h1>
                        <p className="lead mb-4">Discover our latest products with amazing deals and discounts.</p>
                        <Link to="/search">
                          <Button variant="primary" size="lg" className="rounded-pill px-4 py-2">
                            Shop Now <FaArrowRight className="ms-2" />
                          </Button>
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </Col>

          {/* Featured Products */}
          <Col lg={4} className="featured-products bg-light">
            <div className="p-4 h-100 d-flex flex-column">
              <h3 className="mb-4 border-bottom pb-2 text-center text-lg-start">Featured Products</h3>

              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="featured-products-list flex-grow-1 d-flex flex-column justify-content-between">
                  {featuredProducts.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="text-decoration-none"
                    >
                      <Card className="mb-3 featured-product-card border-0 shadow-sm transition">
                        <div className="d-flex align-items-center">
                          <div className="featured-product-img" style={{ width: '120px', height: '120px', padding: '10px' }}>
                            <Card.Img
                              src={product.imageUrl}
                              alt={product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>
                          <Card.Body>
                            <Card.Title className="h6 mb-2" style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {product.name}
                            </Card.Title>
                            <Card.Text className="text-primary fw-bold mb-2">
                              ₹{product.price.toLocaleString('en-IN')}
                            </Card.Text>
                            <div className="d-flex align-items-center">
                              <Badge
                                bg={product.countInStock > 0 ? "success" : "danger"}
                                className="me-2"
                              >
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                              <FaShoppingCart size={14} className="text-secondary" />
                            </div>
                          </Card.Body>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-4 text-center">
                <Link to="/search" className="btn btn-outline-primary rounded-pill px-4">
                  View All Products
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Categories Section */}
      <Container className="mt-5">
        <h2 className="text-center mb-4 section-title">Shop by Category</h2>
        <Row className="g-4 justify-content-center">
          {categories.map((category) => (
            <Col key={category.id} xs={6} md={4} lg={3} xl={2} className="mb-3">
              <Link to={`/search?category=${category.name}`} className="text-decoration-none">
                <div className="category-card text-center p-4 bg-light rounded-lg shadow-sm transition h-100">
                  <div className="category-icon mb-3">
                    <img
                      src={category.icon}
                      alt={category.name}
                      style={{ width: '64px', height: '64px' }}
                    />
                  </div>
                  <h5 className="category-title">{category.name}</h5>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Link to="/search" className="btn btn-outline-primary rounded-pill px-4">
            View All Categories
          </Link>
        </div>
      </Container>

      {/* Promotional Banner */}
      <Container fluid className="mt-5 p-0">
        <div className="promo-banner position-relative">
          <img
            src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Special Offer"
            className="w-100"
            style={{ height: '300px', objectFit: 'cover' }}
          />
          <div className="promo-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
               style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="text-center text-white p-4">
              <h2 className="display-5 fw-bold mb-3">Special Offer</h2>
              <p className="lead mb-4">Get up to 50% off on selected items. Limited time offer!</p>
              <Button variant="outline-light" size="lg" className="rounded-pill px-4">
                Shop the Sale
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
