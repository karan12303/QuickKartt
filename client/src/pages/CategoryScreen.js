import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../data/categories';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaArrowRight } from 'react-icons/fa';

const CategoryScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
      >
        <h1 className="display-text text-gradient-primary mb-3">Explore Categories</h1>
        <p className="lead">Discover our wide range of products across various categories</p>
      </motion.div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Categories */}
          <Row className="g-4">
            {categories.map((category) => (
              <Col key={category.id} lg={4} md={6} className="mb-4">
                <motion.div variants={itemVariants}>
                  <Card className="category-card h-100 glass border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="category-icon me-3">
                          <img
                            src={category.icon}
                            alt={category.name}
                            style={{ width: '48px', height: '48px' }}
                          />
                        </div>
                        <h3 className="mb-0 text-gradient-primary">{category.name}</h3>
                      </div>
                      
                      <div className="subcategories-list">
                        {category.subcategories && category.subcategories.map((subcat) => (
                          <div key={subcat.id} className="mb-3">
                            <h5 className="mb-2 text-gradient-secondary">{subcat.name}</h5>
                            <Row className="g-2">
                              {subcat.subcategories && subcat.subcategories.map((subsubcat) => (
                                <Col key={subsubcat.id} xs={6}>
                                  <Link 
                                    to={`/search?category=${subsubcat.name}`} 
                                    className="subcategory-link d-flex align-items-center"
                                  >
                                    <span className="me-1">{subsubcat.name}</span>
                                    <FaArrowRight size={10} />
                                  </Link>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        ))}
                      </div>
                      
                      <Link 
                        to={`/search?category=${category.name}`} 
                        className="btn btn-gradient-primary mt-3 w-100"
                      >
                        Browse All {category.name}
                      </Link>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
          
          {/* Featured Categories Banner */}
          <motion.div
            className="featured-categories-banner mt-5 p-4 rounded-lg glass"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Row className="align-items-center">
              <Col md={8}>
                <h3 className="text-gradient-primary mb-3">Discover Trending Categories</h3>
                <p className="mb-4">Explore our most popular categories with the latest products and best deals</p>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="primary" className="p-2 badge-pill">Electronics</Badge>
                  <Badge bg="info" className="p-2 badge-pill">Fashion</Badge>
                  <Badge bg="secondary" className="p-2 badge-pill">Home & Kitchen</Badge>
                  <Badge bg="success" className="p-2 badge-pill">Beauty</Badge>
                  <Badge bg="warning" className="p-2 badge-pill">Sports</Badge>
                </div>
              </Col>
              <Col md={4} className="text-end">
                <Link to="/search" className="btn btn-lg btn-gradient-primary">
                  Shop All Products
                </Link>
              </Col>
            </Row>
          </motion.div>
        </motion.div>
      )}
      
      {/* Category Shopping Tips */}
      <motion.div
        className="category-tips mt-5 p-4 rounded-lg glass"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-gradient-secondary mb-4">Shopping Tips</h3>
        <Row className="g-4">
          <Col md={4}>
            <div className="tip-card p-3">
              <h5>Compare Products</h5>
              <p className="mb-0">Use our comparison tool to find the best products that match your needs.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="tip-card p-3">
              <h5>Check Reviews</h5>
              <p className="mb-0">Read customer reviews to make informed purchasing decisions.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="tip-card p-3">
              <h5>Save with Deals</h5>
              <p className="mb-0">Look for special deals and discounts across different categories.</p>
            </div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default CategoryScreen;
