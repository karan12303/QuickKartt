import React, { useState, memo, useRef } from 'react';
import { Button, Badge, Spinner, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaEye, FaExchangeAlt, FaCheck } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { cardHover } from '../utils/animations';
import QuickViewModal from './QuickViewModal';

const AnimatedProductCard = ({ product, addToCart, addToWishlist, addToCompare }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);
  const buttonRef = useRef(null);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const actionButtonVariants = {
    hidden: {
      opacity: 1,
      y: 0
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const staggeredButtonsContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="h-100"
    >
      <motion.div
        className="product-card-futuristic h-100"
        variants={cardHover}
        initial="rest"
        whileHover="hover"
      >
        <div className="product-image">
          <motion.div variants={imageVariants} className="image-container">
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="img-fluid product-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/product-placeholder.svg";
              }}
            />
          </motion.div>

          <div className="product-overlay">
            <motion.div
              className="product-actions"
              variants={staggeredButtonsContainer}
              initial="visible"
              animate="visible"
            >
              <motion.div variants={actionButtonVariants}>
                <Button
                  ref={buttonRef}
                  className={`product-action-btn ${addedToCartSuccess ? 'add-to-cart-success' : ''}`}
                  onClick={() => {
                    setIsAddingToCart(true);
                    setAddedToCartSuccess(true);
                    addToCart(product);
                    setTimeout(() => {
                      setIsAddingToCart(false);
                      setShowAddedToast(true);
                      setTimeout(() => setAddedToCartSuccess(false), 500);
                    }, 1000);
                  }}
                  title="Add to Cart"
                  disabled={isAddingToCart || product.countInStock === 0}
                >
                  {isAddingToCart ? (
                    <Spinner animation="border" size="sm" />
                  ) : addedToCartSuccess ? (
                    <FaCheck size={18} className="text-success" />
                  ) : (
                    <FaShoppingCart size={18} />
                  )}
                </Button>
              </motion.div>

              <motion.div variants={actionButtonVariants}>
                <Button
                  className="product-action-btn"
                  onClick={() => addToWishlist(product)}
                  title="Add to Wishlist"
                >
                  <FaHeart size={18} />
                </Button>
              </motion.div>

              <motion.div variants={actionButtonVariants}>
                <Button
                  className="product-action-btn"
                  title="Quick View"
                  onClick={() => setShowQuickView(true)}
                >
                  <FaEye size={18} />
                </Button>
              </motion.div>

              <motion.div variants={actionButtonVariants}>
                <Button
                  className="product-action-btn"
                  onClick={() => addToCompare(product)}
                  title="Add to Compare"
                >
                  <FaExchangeAlt size={18} />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Product badges */}
          {product.countInStock === 0 && (
            <Badge
              bg="danger"
              className="position-absolute top-0 start-0 m-2"
            >
              Out of Stock
            </Badge>
          )}

          {product.isNew && (
            <Badge
              className="position-absolute top-0 end-0 m-2 badge-gradient-primary"
            >
              New
            </Badge>
          )}

          {product.discount > 0 && (
            <Badge
              className="position-absolute bottom-0 start-0 m-2 badge-gradient-secondary"
            >
              {product.discount}% OFF
            </Badge>
          )}
        </div>

        <div className="product-content">
          <div className="product-category">
            {product.category.split('>').pop().trim()}
          </div>

          <Link to={`/product/${product._id}`} className="text-decoration-none">
            <h5 className="product-title" title={product.name}>{product.name}</h5>
          </Link>

          <div className="d-flex justify-content-between align-items-center price-rating-container">
            <div className="product-price">
              <div>₹{product.price.toLocaleString()}</div>

              {product.discount > 0 && (
                <small className="text-muted text-decoration-line-through">
                  ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                </small>
              )}
            </div>

            <div className="product-rating">
              <div className="product-rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(product.rating || 0) ? "text-warning" : "text-muted"}>
                    ★
                  </span>
                ))}
              </div>
              <div className="product-rating-count">
                ({product.numReviews || 0})
              </div>
            </div>
          </div>

          <motion.div
            className="mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="primary"
              className={`w-100 btn-gradient-primary add-to-cart-btn ${addedToCartSuccess ? 'add-to-cart-success' : ''}`}
              onClick={() => {
                setIsAddingToCart(true);
                setAddedToCartSuccess(true);
                addToCart(product);
                setTimeout(() => {
                  setIsAddingToCart(false);
                  setShowAddedToast(true);
                  setTimeout(() => setAddedToCartSuccess(false), 500);
                }, 1000);
              }}
              disabled={product.countInStock === 0 || isAddingToCart}
            >
              {product.countInStock === 0 ? 'Out of Stock' :
               isAddingToCart ? (
                 <><Spinner as="span" animation="border" size="sm" className="me-2" /> Adding...</>
               ) : addedToCartSuccess ? (
                 <><FaCheck className="me-2" /> Added!</>
               ) : (
                 <><FaShoppingCart className="me-2" /> Add to Cart</>
               )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        show={showQuickView}
        onHide={() => setShowQuickView(false)}
        productId={product._id}
      />

      {/* Added to Cart Toast Notification */}
      <AnimatePresence>
        {showAddedToast && (
          <motion.div
            className="position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1050 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Toast
              onClose={() => setShowAddedToast(false)}
              show={showAddedToast}
              delay={3000}
              autohide
              bg="success"
              className="text-white"
            >
              <Toast.Header closeButton={false}>
                <strong className="me-auto">Added to Cart</strong>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddedToast(false)}
                  aria-label="Close"
                />
              </Toast.Header>
              <Toast.Body className="d-flex align-items-center">
                <img
                  src={product.imageUrl || product.image}
                  alt={product.name}
                  className="me-2"
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                />
                <div>
                  <div className="fw-bold">{product.name}</div>
                  <div>₹{product.price.toLocaleString()}</div>
                </div>
              </Toast.Body>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Use React.memo to prevent unnecessary re-renders when parent component re-renders
// This significantly improves performance when displaying many products
export default memo(AnimatedProductCard, (prevProps, nextProps) => {
  // Only re-render if the product ID changes or if the product data changes
  return prevProps.product._id === nextProps.product._id &&
         prevProps.product.price === nextProps.product.price &&
         prevProps.product.countInStock === nextProps.product.countInStock;
});
