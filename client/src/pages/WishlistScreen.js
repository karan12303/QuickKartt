import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Card, Image, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaShoppingCart, FaTrash, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const WishlistScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get('/api/wishlist', config);
        setWishlistItems(data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Error fetching wishlist'
        );
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchWishlist();
    }
  }, [userInfo]);

  const removeFromWishlistHandler = async (productId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/api/wishlist/${productId}`, config);
      
      // Update local state
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
      setSuccessMessage('Product removed from wishlist');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error removing from wishlist'
      );
    }
  };

  const addToCartHandler = async (product) => {
    try {
      await addToCart(product._id, 1);
      setSuccessMessage(`${product.name} added to cart`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError('Error adding to cart');
    }
  };

  return (
    <div className="wishlist-screen">
      <Link to="/" className="btn btn-light my-3">
        <FaArrowLeft className="me-2" /> Continue Shopping
      </Link>
      
      <h1 className="mb-4">
        <FaHeart className="text-danger me-2" /> My Wishlist
      </h1>
      
      {successMessage && (
        <Alert variant="success" className="fade-out">
          {successMessage}
        </Alert>
      )}
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : wishlistItems.length === 0 ? (
        <Message>
          Your wishlist is empty. <Link to="/">Go Shopping</Link>
        </Message>
      ) : (
        <Row>
          <Col md={9}>
            <ListGroup variant="flush">
              {wishlistItems.map((item) => (
                <ListGroup.Item key={item._id} className="p-3">
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fluid
                        rounded
                        className="product-image"
                      />
                    </Col>
                    <Col md={4}>
                      <Link to={`/product/${item._id}`} className="product-name">
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2}>₹{item.price.toLocaleString('en-IN')}</Col>
                    <Col md={2}>
                      <div className={`stock-status ${item.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </Col>
                    <Col md={2} className="d-flex justify-content-end">
                      <Button
                        variant="primary"
                        className="btn-sm me-2"
                        disabled={item.countInStock === 0}
                        onClick={() => addToCartHandler(item)}
                      >
                        <FaShoppingCart />
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => removeFromWishlistHandler(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Wishlist Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Total Items:</Col>
                      <Col className="text-end">{wishlistItems.length}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items In Stock:</Col>
                      <Col className="text-end">
                        {wishlistItems.filter(item => item.countInStock > 0).length}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default WishlistScreen;
