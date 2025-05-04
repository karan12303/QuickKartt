import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Message from '../components/Message';
import axios from 'axios';
import Loader from '../components/Loader';
import CheckoutSteps from '../components/CheckoutSteps';
import OrderSummaryItem from '../components/OrderSummaryItem';
import { FaCreditCard, FaPaypal, FaMobileAlt, FaMoneyBillWave, FaShoePrints, FaSdCard, FaMemory, FaShoppingBag } from 'react-icons/fa';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  // Redirect to payment if payment method is not selected
  useEffect(() => {
    if (!paymentMethod || !paymentMethod.method) {
      navigate('/payment');
    }
  }, [navigate, paymentMethod]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 5000 ? 0 : 100;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Debug shipping address
      console.log('Shipping address:', shippingAddress);

      // Check if shipping address is valid and has all required fields
      if (!shippingAddress || !shippingAddress.fullName) {
        throw new Error('Invalid shipping address. Please select a valid address.');
      }

      // Ensure all required shipping address fields are present
      const requiredFields = ['fullName', 'addressLine', 'city', 'pinCode', 'phone'];
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          throw new Error(`Shipping address is missing ${field}. Please select a valid address.`);
        }
      }

      // Debug cart items
      console.log('Cart items:', cartItems);

      const orderItems = cartItems.map((item) => {
        // Ensure imageUrl is included and not undefined
        if (!item.imageUrl) {
          console.warn(`Item ${item.name} is missing imageUrl`);
        }

        // Create order item with basic properties
        const orderItem = {
          name: item.name,
          qty: item.qty,
          imageUrl: item.imageUrl || 'https://via.placeholder.com/150', // Provide a default if missing
          price: item.price,
          product: item.product,
        };

        // Add variation details if present
        if (item.hasVariations) {
          orderItem.hasVariations = true;

          if (item.footwearSize) {
            orderItem.footwearSize = {
              ukSize: item.footwearSize.ukSize,
              usSize: item.footwearSize.usSize
            };
          }

          if (item.smartphoneSpec) {
            orderItem.smartphoneSpec = {
              model: item.smartphoneSpec.model,
              storage: item.smartphoneSpec.storage,
              ram: item.smartphoneSpec.ram
            };
          }
        }

        return orderItem;
      });

      // Create a clean shipping address object with only the required fields
      const cleanShippingAddress = {
        fullName: shippingAddress.fullName,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city,
        pinCode: shippingAddress.pinCode,
        phone: shippingAddress.phone,
      };

      // Debug order data
      const orderData = {
        orderItems,
        shippingAddress: cleanShippingAddress,
        paymentMethod: paymentMethod.method,
        totalPrice,
      };

      console.log('Sending order data:', orderData);

      const { data } = await axios.post(
        '/api/orders',
        orderData,
        config
      );

      setLoading(false);
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setLoading(false);

      // Get detailed error message
      let errorMessage = error.message;
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.message || error.response.data.error || error.message;
      }

      setError(errorMessage);
    }
  };

  // Helper function to render payment method icon
  const renderPaymentIcon = () => {
    if (!paymentMethod || !paymentMethod.method) return null;

    switch (paymentMethod.method) {
      case 'paypal':
        return <FaPaypal className="text-primary" size={24} />;
      case 'card':
        return <FaCreditCard className="text-primary" size={24} />;
      case 'upi':
        return <FaMobileAlt className="text-primary" size={24} />;
      case 'cod':
        return <FaMoneyBillWave className="text-primary" size={24} />;
      default:
        return null;
    }
  };

  // Helper function to get payment method name
  const getPaymentMethodName = () => {
    if (!paymentMethod || !paymentMethod.method) return 'Not Selected';

    switch (paymentMethod.method) {
      case 'paypal':
        return 'PayPal';
      case 'card':
        return 'Credit/Debit Card';
      case 'upi':
        return 'UPI';
      case 'cod':
        return 'Cash On Delivery';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.fullName}, {shippingAddress.addressLine},{' '}
                {shippingAddress.city}, {shippingAddress.pinCode}
              </p>
              <p>
                <strong>Phone: </strong>
                {shippingAddress.phone}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p className="d-flex align-items-center">
                {renderPaymentIcon()}
                <span className="ms-2">
                  <strong>{getPaymentMethodName()}</strong>
                </span>
              </p>
              {paymentMethod && paymentMethod.method === 'card' && paymentMethod.details && (
                <p>
                  <strong>Card: </strong>
                  **** **** **** {paymentMethod.details.cardNumber.slice(-4)}
                </p>
              )}
              {paymentMethod && paymentMethod.method === 'upi' && paymentMethod.details && (
                <p>
                  <strong>UPI ID: </strong>
                  {paymentMethod.details.upiId}
                </p>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2 className="mb-3">
                <FaShoppingBag className="me-2" />
                Order Items
              </h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="order-items-container"
                >
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <OrderSummaryItem key={item.cartItemKey || item.product} item={item} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="order-summary-futuristic">
              <ListGroup variant="flush">
                <ListGroup.Item className="order-header">
                  <h2 className="mb-0">Order Summary</h2>
                </ListGroup.Item>

                <div className="order-summary-totals">
                  <div className="order-summary-total-row">
                    <span>Items</span>
                    <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-summary-total-row">
                    <span>Shipping</span>
                    <span>₹{shippingPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-summary-total-row">
                    <span>Tax (GST)</span>
                    <span>₹{taxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-summary-total-row final">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {error && (
                  <ListGroup.Item>
                    <Message variant="danger">{error}</Message>
                  </ListGroup.Item>
                )}

                <ListGroup.Item className="p-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      className="w-100 btn-gradient-primary py-3"
                      disabled={cartItems.length === 0 || loading}
                      onClick={placeOrderHandler}
                    >
                      {loading ? <Loader /> : 'Place Order'}
                    </Button>
                  </motion.div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
