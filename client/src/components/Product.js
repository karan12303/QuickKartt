import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaShoppingCart, FaTag, FaBoxOpen, FaHeart, FaEye, FaExchangeAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { CompareContext } from '../context/CompareContext';
import QuickViewModal from './QuickViewModal';
import axios from 'axios';
import './Product.css';

const Product = ({ product }) => {
  const { userInfo } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToCompare, isInCompareList, compareList } = useContext(CompareContext);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [compareAdded, setCompareAdded] = useState(false);

  // Check if product is in stock
  const inStock = product.countInStock > 0;

  // Check if product is in wishlist and compare list when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        if (!userInfo || !product._id) return;

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`/api/wishlist/check/${product._id}`, config);
        setIsInWishlist(data.isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    // Check if product is in compare list
    const checkCompareStatus = () => {
      if (product._id) {
        const isInCompare = isInCompareList(product._id);
        setCompareAdded(isInCompare);
      }
    };

    if (userInfo && product._id) {
      checkWishlistStatus();
    }

    checkCompareStatus();
  }, [userInfo, product._id, compareList]);

  // Update compareAdded state whenever compareList changes
  useEffect(() => {
    if (product._id) {
      const isInCompare = isInCompareList(product._id);
      setCompareAdded(isInCompare);
    }
  }, [compareList, product._id, isInCompareList]);

  // Toggle wishlist status
  const toggleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation to product details

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
        await axios.delete(`/api/wishlist/${product._id}`, config);
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        await axios.post('/api/wishlist', { productId: product._id }, config);
        setIsInWishlist(true);
      }

      setWishlistLoading(false);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setWishlistLoading(false);
    }
  };

  // Determine stock level for visual indicator
  const getStockLevel = () => {
    if (product.countInStock <= 0) return 'outOfStock';
    if (product.countInStock < 5) return 'low';
    if (product.countInStock < 10) return 'medium';
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
    if (product.countInStock <= 0) return 0;
    if (product.countInStock >= 20) return 100;
    return (product.countInStock / 20) * 100;
  };

  // Ensure product ID is a string
  const productId = product._id ? product._id.toString() : '';

  // Handle adding product to compare list
  const handleAddToCompare = (e) => {
    e.preventDefault(); // Prevent navigation to product details
    e.stopPropagation(); // Prevent event bubbling

    try {
      // Check if product is already in compare list to avoid duplicates
      if (compareAdded) {
        console.log('Product already in compare list:', product._id);
        return;
      }

      console.log('Adding product to compare:', product._id);
      const success = addToCompare(product);

      if (success) {
        setCompareAdded(true);
        // Show feedback to user
        const toast = document.createElement('div');
        toast.className = 'toast-notification success';
        toast.textContent = 'Product added to compare list';
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
          toast.classList.add('hide');
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding product to compare:', error);
    }
  };

  return (
    <Card className="product-card">
      <div className="position-relative">
        <Link to={`/product/${productId}`}>
          <div className="product-image-container">
            <Card.Img
              src={product.imageUrl || product.image || '/images/product-placeholder.svg'}
              variant="top"
              className="card-img-top"
              alt={product.name}
            />
          </div>
        </Link>

        {/* Category Badge */}
        <Badge
          bg="secondary"
          className="position-absolute top-0 start-0 m-2"
          style={{ zIndex: 1 }}
        >
          <FaTag className="me-1" /> {product.category}
        </Badge>

        {/* Stock Badge */}
        <Badge
          className={`position-absolute top-0 end-0 m-2 badge-${inStock ? (getStockLevel() === 'low' ? 'low-stock' : 'stock') : 'out-of-stock'}`}
          style={{ zIndex: 1 }}
        >
          {inStock ? (getStockLevel() === 'low' ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
        </Badge>
      </div>

      <Card.Body>
        <Link
          to={`/product/${productId}`}
          className="text-decoration-none"
        >
          <Card.Title className="card-title">
            {product.name}
          </Card.Title>
        </Link>

        <Card.Text className="card-text">
          {product.description.substring(0, 60)}...
        </Card.Text>

        <div className="price mb-3">
          ₹{product.price.toLocaleString('en-IN')}
        </div>

        {/* Stock Indicator */}
        <div className="stock-indicator mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="d-flex align-items-center">
              <FaBoxOpen className={`me-1 text-${getProgressVariant()}`} />
              <small className={`fw-bold text-${getProgressVariant()}`}>
                {inStock ? `${product.countInStock} in stock` : 'Out of stock'}
              </small>
            </div>
            {inStock && getStockLevel() === 'low' && (
              <small className="text-warning fw-bold">Low stock!</small>
            )}
          </div>
          <ProgressBar
            variant={getProgressVariant()}
            now={getStockPercentage()}
            style={{ height: '6px' }}
          />
        </div>

        <div className="d-flex gap-2 mb-2">
          <Button
            variant={isInWishlist ? "danger" : "outline-danger"}
            className="d-flex align-items-center justify-content-center"
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            style={{ width: '48px' }}
          >
            <FaHeart />
          </Button>
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center justify-content-center"
            onClick={() => setShowQuickView(true)}
            style={{ width: '48px' }}
          >
            <FaEye />
          </Button>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{compareAdded ? 'Added to compare' : 'Add to compare'}</Tooltip>}
          >
            <div> {/* Wrapper div to handle disabled button in OverlayTrigger */}
              <Button
                variant={compareAdded ? "info" : "outline-info"}
                className="d-flex align-items-center justify-content-center"
                onClick={handleAddToCompare}
                style={{ width: '48px' }}
                disabled={compareAdded}
              >
                <FaExchangeAlt />
              </Button>
            </div>
          </OverlayTrigger>
        </div>

        <div className="d-grid">
          <Button
            variant="primary"
            className="d-flex align-items-center justify-content-center"
            onClick={() => addToCart(product, 1)}
            disabled={!inStock}
          >
            <FaShoppingCart className="me-2" /> Add to Cart
          </Button>
        </div>

        {/* Quick View Modal */}
        <QuickViewModal
          show={showQuickView}
          onHide={() => setShowQuickView(false)}
          productId={productId}
        />
      </Card.Body>
    </Card>
  );
};

export default Product;
