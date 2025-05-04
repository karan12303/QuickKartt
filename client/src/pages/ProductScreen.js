import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Form, Badge, ProgressBar, Alert } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import RecommendationEngine from '../components/RecommendationEngine';
import Product3DViewer from '../components/Product3DViewer';
import SizeGuide from '../components/SizeGuide';
import ImageMagnifier from '../components/ImageMagnifier';
import ReviewList from '../components/ReviewList';
import SocialShare from '../components/SocialShare';
import { FaBoxOpen, FaShoppingCart, FaExclamationTriangle, FaMobileAlt, FaMemory, FaSdCard, FaShoePrints, FaHeart, FaImage, FaInfoCircle } from 'react-icons/fa';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewMode, setViewMode] = useState('image'); // 'image' or '3d'
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Variation states
  const [selectedFootwearSize, setSelectedFootwearSize] = useState(null);
  const [selectedSmartphoneSpec, setSelectedSmartphoneSpec] = useState(null);
  const [availableStock, setAvailableStock] = useState(0);

  // Wishlist states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  // Fetch product details
  useEffect(() => {
    // Check if product is in user's wishlist
    const checkWishlistStatus = async () => {
      try {
        if (!userInfo) return;

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`/api/wishlist/check/${id}`, config);
        setIsInWishlist(data.isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    const fetchProduct = async () => {
      try {
        // Validate ID before making the request
        if (!id) {
          setError('Invalid product ID');
          setLoading(false);
          return;
        }

        // Ensure id is a string, not an object
        let productId = id;
        if (typeof productId === 'object') {
          console.error('Invalid product ID type:', typeof productId, productId);
          if (productId._id) {
            productId = productId._id.toString();
          } else {
            productId = productId.toString(); // Try to convert to string
          }
        }

        // Make sure productId is a valid MongoDB ObjectId (24 hex characters)
        if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
          console.error('Invalid MongoDB ObjectId format:', productId);
          setError('Invalid product ID format');
          setLoading(false);
          return;
        }

        console.log('Fetching product with ID:', productId);
        const { data } = await axios.get(`/api/products/${productId}`);

        if (!data) {
          setError('No product data received');
          setLoading(false);
          return;
        }

        console.log('Product data received:', data);
        setProduct(data);

        // Safely set the image URL
        if (data.imageUrl) {
          setSelectedImage(data.imageUrl);
        }

        // Handle variations based on product category
        if (data.hasVariations) {
          if (data.category === 'Footwear' && data.footwearSizes && data.footwearSizes.length > 0) {
            // Set default selected size to the first available size with stock
            const availableSize = data.footwearSizes.find(size => size.countInStock > 0);
            if (availableSize) {
              setSelectedFootwearSize(availableSize);
              setAvailableStock(availableSize.countInStock);
            } else {
              setAvailableStock(0); // No sizes in stock
            }
          } else if (data.category === 'Smartphone' && data.smartphoneSpecs && data.smartphoneSpecs.length > 0) {
            // Set default selected spec to the first available spec with stock
            const availableSpec = data.smartphoneSpecs.find(spec => spec.countInStock > 0);
            if (availableSpec) {
              setSelectedSmartphoneSpec(availableSpec);
              setAvailableStock(availableSpec.countInStock);
            } else {
              setAvailableStock(0); // No specs in stock
            }
          } else {
            // Product has variations but no specific variation data
            setAvailableStock(data.countInStock || 0);
          }
        } else {
          // For products without variations, use the product's countInStock
          setAvailableStock(data.countInStock || 0);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);

        // Improved error handling
        let errorMessage = 'An error occurred while fetching the product';

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = 'No response from server. Please check your connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = error.message;
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchProduct();

    // Check wishlist status after product is loaded
    if (id && userInfo) {
      checkWishlistStatus();
    }
  }, [id, userInfo]);



  // Toggle wishlist status
  const toggleWishlist = async () => {
    if (!userInfo) {
      navigate('/login');
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
        await axios.delete(`/api/wishlist/${id}`, config);
        setIsInWishlist(false);
        setSuccessMessage('Product removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post('/api/wishlist', { productId: id }, config);
        setIsInWishlist(true);
        setSuccessMessage('Product added to wishlist');
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      setWishlistLoading(false);
    } catch (error) {
      setError('Error updating wishlist');
      setWishlistLoading(false);
    }
  };



  // Determine stock level for visual indicator
  const getStockLevel = () => {
    if (!availableStock || availableStock <= 0) return 'outOfStock';
    if (availableStock < 5) return 'low';
    if (availableStock < 10) return 'medium';
    return 'high';
  };

  // Get progress bar variant based on stock level
  const getProgressVariant = () => {
    const level = getStockLevel();
    switch (level) {
      case 'outOfStock': return 'danger';
      case 'low': return 'warning';
      case 'medium': return 'info';
      case 'high': return 'success';
      default: return 'success';
    }
  };

  // Calculate progress percentage for stock indicator
  const getStockPercentage = () => {
    if (!availableStock || availableStock <= 0) return 0;
    if (availableStock >= 20) return 100;
    return (availableStock / 20) * 100;
  };

  // Handle footwear size selection
  const handleFootwearSizeChange = (size) => {
    setSelectedFootwearSize(size);
    setAvailableStock(size.countInStock);
    // Reset quantity if it's more than available stock
    if (qty > size.countInStock) {
      setQty(1);
    }
  };

  // Handle smartphone spec selection
  const handleSmartphoneSpecChange = (spec) => {
    setSelectedSmartphoneSpec(spec);
    setAvailableStock(spec.countInStock);
    // Reset quantity if it's more than available stock
    if (qty > spec.countInStock) {
      setQty(1);
    }
  };

  const addToCartHandler = async () => {
    // Ensure we have a valid product ID
    if (!product || !product._id) {
      setError('Invalid product data');
      return;
    }

    // Use product._id directly from the product object and ensure it's a string
    const productId = product._id.toString();

    // Check if we need to include variation details
    if (product.hasVariations) {
      if (product.category === 'Footwear' && selectedFootwearSize) {
        await addToCart(productId, qty, {
          hasVariations: true,
          footwearSize: selectedFootwearSize
        });
      } else if (product.category === 'Smartphone' && selectedSmartphoneSpec) {
        await addToCart(productId, qty, {
          hasVariations: true,
          smartphoneSpec: selectedSmartphoneSpec
        });
      } else {
        // If no variation is selected but product has variations, show error
        setError('Please select a variation before adding to cart');
        return;
      }
    } else {
      // Regular product without variations
      await addToCart(productId, qty);
    }
    navigate('/cart');
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {/* Success message */}
      {successMessage && (
        <Alert variant="success" className="fade-out">
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !product || Object.keys(product).length === 0 ? (
        <Message variant="danger">Product data could not be loaded</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="product-view-container glass rounded-lg p-3 mb-4"
              >
                {/* View mode toggle */}
                <div className="d-flex justify-content-end mb-3">
                  <div className="btn-group">
                    <Button
                      variant={viewMode === 'image' ? 'primary' : 'outline-primary'}
                      className="btn-sm"
                      onClick={() => setViewMode('image')}
                    >
                      <FaImage className="me-1" /> 2D View
                    </Button>
                    <Button
                      variant={viewMode === '3d' ? 'primary' : 'outline-primary'}
                      className="btn-sm"
                      onClick={() => setViewMode('3d')}
                    >
                      <FaInfoCircle className="me-1" /> 3D View
                    </Button>
                  </div>
                </div>

                {/* Product view based on selected mode */}
                {viewMode === 'image' ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageMagnifier
                      src={selectedImage || 'https://via.placeholder.com/400x400?text=No+Image+Available'}
                      alt={product.name || 'Product Image'}
                      height="400px"
                      zoomLevel={2.5}
                    />
                    <div className="text-center mt-2 mb-3">
                      <small className="text-muted">
                        <FaInfoCircle className="me-1" /> Hover or touch to zoom
                      </small>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg overflow-hidden shadow-sm"
                    style={{ height: '400px' }}
                  >
                    <Product3DViewer
                      productImage={selectedImage || product.imageUrl}
                      height="400px"
                      backgroundColor="#f8f9fa"
                    />
                  </motion.div>
                )}

                {/* Thumbnail gallery */}
                {(product.additionalImages && product.additionalImages.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Row className="mt-3">
                      <Col className="d-flex flex-wrap">
                        {/* Main image thumbnail */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedImage(product.imageUrl)}
                          className={`product-thumbnail me-2 mb-2 ${selectedImage === product.imageUrl ? 'active' : ''}`}
                          style={{
                            cursor: 'pointer',
                            border: selectedImage === product.imageUrl ? '2px solid var(--primary)' : '1px solid #ddd',
                            padding: '3px',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}
                        >
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        </motion.div>

                        {/* Additional images thumbnails */}
                        {product.additionalImages.map((img, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedImage(img)}
                            className={`product-thumbnail me-2 mb-2 ${selectedImage === img ? 'active' : ''}`}
                            style={{
                              cursor: 'pointer',
                              border: selectedImage === img ? '2px solid var(--primary)' : '1px solid #ddd',
                              padding: '3px',
                              borderRadius: '8px',
                              overflow: 'hidden'
                            }}
                          >
                            <Image
                              src={img}
                              alt={`${product.name} - ${index + 1}`}
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                          </motion.div>
                        ))}
                      </Col>
                    </Row>
                  </motion.div>
                )}
              </motion.div>
            </Col>
          <Col md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass rounded-lg overflow-hidden mb-4"
            >
              <ListGroup variant="flush" className="border-0">
                <ListGroup.Item className="glass border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <motion.h3
                      className="text-gradient-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {product.name}
                    </motion.h3>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={isInWishlist ? "danger" : "outline-danger"}
                        className="d-flex align-items-center justify-content-center"
                        onClick={toggleWishlist}
                        disabled={wishlistLoading}
                        style={{ width: '46px', height: '46px', borderRadius: '50%', padding: '0' }}
                      >
                        <FaHeart size={20} />
                      </Button>
                    </motion.div>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item className="glass border-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Badge bg="primary" className="badge-gradient-primary mb-2">
                      {product.category}
                    </Badge>
                    <h4 className="text-gradient-secondary mt-2">
                      ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
                    </h4>
                  </motion.div>
                </ListGroup.Item>

                <ListGroup.Item className="glass border-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <h5 className="text-gradient-primary">Description</h5>
                    <p>{product.description}</p>
                  </motion.div>
                </ListGroup.Item>

                <ListGroup.Item className="glass border-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="d-flex justify-content-between"
                  >
                    <div>
                      <Badge bg="success" className="me-2">Free Shipping</Badge>
                      <Badge bg="info">Secure Payment</Badge>
                    </div>
                    <div>
                      <Badge bg="warning" text="dark">Top Rated</Badge>
                    </div>
                  </motion.div>
                </ListGroup.Item>
              </ListGroup>
            </motion.div>
          </Col>
          <Col md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-lg overflow-hidden"
            >
              <ListGroup variant="flush" className="border-0">
                <ListGroup.Item className="glass border-0">
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong className="text-gradient-primary">₹{product.price ? product.price.toLocaleString('en-IN') : '0'}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Footwear Size Selection */}
                {product.hasVariations && product.category === 'Footwear' && product.footwearSizes && product.footwearSizes.length > 0 && (
                  <ListGroup.Item className="glass border-0">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 text-gradient-primary">Select Size</h5>
                        <Button
                          variant="link"
                          className="p-0 text-primary"
                          onClick={() => setShowSizeGuide(true)}
                        >
                          <FaInfoCircle className="me-1" /> Size Guide
                        </Button>
                      </div>
                      <Row className="mb-2">
                        <Col xs={6}>
                          <div className="d-flex align-items-center mb-1">
                            <FaShoePrints className="me-2 text-gradient-secondary" />
                            <small className="text-gradient-secondary">UK Size</small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="d-flex align-items-center mb-1">
                            <FaShoePrints className="me-2 text-gradient-secondary" />
                            <small className="text-gradient-secondary">US Size</small>
                          </div>
                        </Col>
                      </Row>
                      <div className="d-flex flex-wrap">
                        {product.footwearSizes.map((size, index) => (
                          <motion.div
                            key={index}
                            whileHover={size.countInStock > 0 ? { scale: 1.05 } : {}}
                            whileTap={size.countInStock > 0 ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                          >
                            <Button
                              variant={selectedFootwearSize && selectedFootwearSize.ukSize === size.ukSize ? 'primary' : 'outline-secondary'}
                              className={`me-2 mb-2 position-relative ${selectedFootwearSize && selectedFootwearSize.ukSize === size.ukSize ? 'btn-gradient-primary' : ''}`}
                              style={{ width: '70px', height: '70px', borderRadius: '12px' }}
                              onClick={() => handleFootwearSizeChange(size)}
                              disabled={size.countInStock === 0}
                            >
                              <div className="d-flex flex-column align-items-center justify-content-center">
                                <div className="fw-bold">{size.ukSize}</div>
                                <small className="text-muted">US: {size.usSize}</small>
                              </div>
                              {size.countInStock === 0 && (
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75" style={{ borderRadius: '12px' }}>
                                  <small className="text-danger">Sold out</small>
                                </div>
                              )}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </ListGroup.Item>
                )}

                {/* Smartphone Specifications Selection */}
                {product.hasVariations && product.category === 'Smartphone' && product.smartphoneSpecs && product.smartphoneSpecs.length > 0 && (
                  <ListGroup.Item className="glass border-0">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <h5 className="mb-3 text-gradient-primary">Select Specifications</h5>

                      {/* Group specs by model */}
                      {[...new Set(product.smartphoneSpecs.map(spec => spec.model))].map((model, modelIndex) => (
                        <motion.div
                          key={modelIndex}
                          className="mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + (modelIndex * 0.1) }}
                        >
                          <h6 className="d-flex align-items-center mb-2 text-gradient-secondary">
                            <FaMobileAlt className="me-2" />
                            Model: {model}
                          </h6>

                          <div className="d-flex flex-wrap">
                            {product.smartphoneSpecs
                              .filter(spec => spec.model === model)
                              .map((spec, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={spec.countInStock > 0 ? { scale: 1.05 } : {}}
                                  whileTap={spec.countInStock > 0 ? { scale: 0.95 } : {}}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.05) }}
                                >
                                  <Button
                                    variant={selectedSmartphoneSpec &&
                                      selectedSmartphoneSpec.model === spec.model &&
                                      selectedSmartphoneSpec.storage === spec.storage &&
                                      selectedSmartphoneSpec.ram === spec.ram
                                        ? 'primary' : 'outline-secondary'}
                                    className={`me-2 mb-2 position-relative ${selectedSmartphoneSpec &&
                                      selectedSmartphoneSpec.model === spec.model &&
                                      selectedSmartphoneSpec.storage === spec.storage &&
                                      selectedSmartphoneSpec.ram === spec.ram ? 'btn-gradient-primary' : ''}`}
                                    style={{ minWidth: '120px', borderRadius: '12px' }}
                                    onClick={() => handleSmartphoneSpecChange(spec)}
                                    disabled={spec.countInStock === 0}
                                  >
                                    <div className="d-flex flex-column align-items-start p-2">
                                      <div className="d-flex align-items-center mb-1">
                                        <FaSdCard className="me-1" size={12} />
                                        <small>{spec.storage}</small>
                                      </div>
                                      <div className="d-flex align-items-center">
                                        <FaMemory className="me-1" size={12} />
                                        <small>{spec.ram}</small>
                                      </div>
                                    </div>
                                    {spec.countInStock === 0 && (
                                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75" style={{ borderRadius: '12px' }}>
                                        <small className="text-danger">Sold out</small>
                                      </div>
                                    )}
                                  </Button>
                                </motion.div>
                              ))}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </ListGroup.Item>
                )}

                <ListGroup.Item className="glass border-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <h5 className="mb-2 text-gradient-primary">Stock Status</h5>
                    <div className="d-flex align-items-center mb-2">
                      <FaBoxOpen className={`me-2 text-${getProgressVariant()}`} size={18} />
                      <Badge bg={getProgressVariant()} className={`py-2 px-3 badge-gradient-${getStockLevel() === 'high' ? 'primary' : getStockLevel() === 'medium' ? 'secondary' : 'accent'}`}>
                        {availableStock > 0
                          ? `${availableStock} in stock`
                          : 'Out of stock'}
                      </Badge>

                      {getStockLevel() === 'low' && availableStock > 0 && (
                        <motion.div
                          className="ms-2 text-warning d-flex align-items-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <FaExclamationTriangle className="me-1" />
                          <small className="fw-bold">Low stock!</small>
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <ProgressBar
                        variant={getProgressVariant()}
                        now={getStockPercentage()}
                        className="mb-2 progress-bar-gradient"
                        style={{ height: '8px', borderRadius: '4px' }}
                      />
                    </motion.div>

                    {availableStock === 0 && (
                      <motion.div
                        className="text-danger small mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                      >
                        <strong>Note:</strong> This item is currently out of stock. Please check back later.
                      </motion.div>
                    )}

                    {availableStock > 0 && availableStock < 5 && (
                      <motion.div
                        className="text-warning small mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                      >
                        <strong>Hurry!</strong> Only {availableStock} items left in stock.
                      </motion.div>
                    )}
                  </motion.div>
                </ListGroup.Item>

                {availableStock > 0 && (
                  <ListGroup.Item className="glass border-0">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <Row className="align-items-center">
                        <Col>
                          <span className="text-gradient-secondary">Qty</span>
                        </Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="glass"
                          >
                            {[...Array(Math.min(availableStock, 10)).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </motion.div>
                  </ListGroup.Item>
                )}

                <ListGroup.Item className="glass border-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <div className="d-flex gap-2 mb-3">
                      <motion.div
                        className="flex-grow-1"
                        whileHover={availableStock > 0 ? { scale: 1.03 } : {}}
                        whileTap={availableStock > 0 ? { scale: 0.97 } : {}}
                      >
                        <Button
                          onClick={addToCartHandler}
                          className="w-100 d-flex align-items-center justify-content-center btn-gradient-primary"
                          type="button"
                          disabled={availableStock === 0 ||
                            (product.hasVariations && product.category === 'Footwear' && !selectedFootwearSize) ||
                            (product.hasVariations && product.category === 'Smartphone' && !selectedSmartphoneSpec)
                          }
                          variant={availableStock === 0 ? "secondary" : "primary"}
                          size="lg"
                        >
                          <FaShoppingCart className="me-2" />
                          {availableStock === 0 ? 'Out of Stock' : 'Add To Cart'}
                        </Button>
                      </motion.div>

                      <SocialShare
                        url={window.location.href}
                        title={product.name}
                        image={product.imageUrl}
                        description={product.description}
                      />
                    </div>

                    {/* Show message if variation selection is required */}
                    {product.hasVariations && (
                      (product.category === 'Footwear' && !selectedFootwearSize && availableStock > 0) ||
                      (product.category === 'Smartphone' && !selectedSmartphoneSpec && availableStock > 0)
                    ) && (
                      <motion.div
                        className="text-danger small mt-2 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Please select {product.category === 'Footwear' ? 'a size' : 'specifications'} before adding to cart
                      </motion.div>
                    )}
                  </motion.div>
                </ListGroup.Item>
              </ListGroup>
            </motion.div>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row className="mt-5">
          <Col xs={12}>
            <ReviewList productId={id} />
          </Col>
        </Row>

        {/* Personalized Recommendations */}
        <RecommendationEngine currentProductId={id} category={product.category} />

        {/* Size Guide Modal */}
        <SizeGuide
          show={showSizeGuide}
          onHide={() => setShowSizeGuide(false)}
          category={product.category || 'All'}
        />
        </>
      )}
    </>
  );
};

export default ProductScreen;
