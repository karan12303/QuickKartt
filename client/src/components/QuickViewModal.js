import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Row, Col, Image, ListGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ImageMagnifier from './ImageMagnifier';
import axios from 'axios';

const QuickViewModal = ({ show, onHide, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  // Fetch product data when productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        if (!userInfo || !productId) return;

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`/api/wishlist/check/${productId}`, config);
        setIsInWishlist(data.isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    if (userInfo && productId) {
      checkWishlistStatus();
    }
  }, [userInfo, productId]);

  // Toggle wishlist status
  const toggleWishlist = async () => {
    if (!userInfo) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }

    try {
      setWishlistLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`/api/wishlist/${productId}`, config);
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        await axios.post('/api/wishlist', { productId }, config);
        setIsInWishlist(true);
      }

      setWishlistLoading(false);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setWishlistLoading(false);
    }
  };

  // Add to cart handler
  const addToCartHandler = () => {
    addToCart(product, qty);
    // Optional: Close modal after adding to cart
    // onHide();
  };

  // Get all product images (main + additional)
  const getAllImages = () => {
    if (!product) return [];

    const images = [product.imageUrl];
    if (product.additionalImages && product.additionalImages.length > 0) {
      images.push(...product.additionalImages);
    }
    return images;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="quick-view-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <strong style={{ color: '#FF6B00', fontSize: '1.3rem' }}>Quick</strong>
          <span style={{ color: 'white', fontSize: '1.3rem' }}>Kart</span>
          <span className="ms-2">| Quick View</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : product ? (
          <Row>
            {/* Product Images */}
            <Col md={6}>
              <div className="product-image-gallery">
                <div className="main-image mb-3">
                  <ImageMagnifier
                    src={getAllImages()[selectedImage] || product.imageUrl}
                    alt={product.name}
                    height="300px"
                    magnifierHeight={120}
                    magnifierWidth={120}
                    zoomLevel={2.2}
                  />
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      <FaInfoCircle className="me-1" /> Hover or touch to zoom
                    </small>
                  </div>
                </div>
                {getAllImages().length > 1 && (
                  <Row className="image-thumbnails">
                    {getAllImages().map((img, index) => (
                      <Col xs={3} key={index}>
                        <Image
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          thumbnail
                          className={`cursor-pointer ${selectedImage === index ? 'border-primary' : ''}`}
                          onClick={() => setSelectedImage(index)}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Col>

            {/* Product Details */}
            <Col md={6}>
              <h4 className="product-title">{product.name}</h4>
              <h5 className="text-primary mb-3 fw-bold">₹{product.price.toLocaleString('en-IN')}</h5>

              <div className="product-description mb-3">
                <p>{product.description}</p>
              </div>

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="px-0">
                  <strong>Category:</strong> {product.category}
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Status:</strong>{' '}
                  {product.countInStock > 0 ? (
                    <span className="text-success">In Stock</span>
                  ) : (
                    <span className="text-danger">Out of Stock</span>
                  )}
                </ListGroup.Item>
              </ListGroup>

              {product.countInStock > 0 && (
                <div className="d-flex align-items-center mb-3">
                  <Form.Label className="me-3 mb-0">Quantity:</Form.Label>
                  <Form.Select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    style={{ width: '80px' }}
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              )}

              <div className="d-flex gap-2 mb-3">
                <Button
                  variant="primary"
                  className="flex-grow-1"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  <FaShoppingCart className="me-2" /> Add to Cart
                </Button>
                <Button
                  variant={isInWishlist ? "danger" : "outline-danger"}
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                >
                  {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                </Button>
              </div>

              <Link to={`/product/${product._id}`} className="btn btn-outline-primary w-100 mt-2">
                <span style={{ color: '#FF6B00' }}>View Full</span> <span>Details</span> <FaArrowRight className="ms-2" />
              </Link>
            </Col>
          </Row>
        ) : (
          <div className="alert alert-info">No product selected</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewModal;
