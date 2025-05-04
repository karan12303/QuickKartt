import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card, Badge, Accordion, Alert } from 'react-bootstrap';
import {
  FaTrash,
  FaShoePrints,
  FaMobileAlt,
  FaSdCard,
  FaMemory,
  FaCreditCard,
  FaPaypal,
  FaMobileAlt as FaUpi,
  FaMoneyBillWave,
  FaShieldAlt,
  FaLock,
  FaArrowRight
} from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';

const CartScreen = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const [expressCheckoutMethod, setExpressCheckoutMethod] = useState('');
  const [showExpressCheckout, setShowExpressCheckout] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState({ text: '', type: '' });

  // Regular checkout handler
  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  // Express checkout handler
  const expressCheckoutHandler = () => {
    if (!expressCheckoutMethod) {
      setPaymentMessage({ text: 'Please select a payment method', type: 'warning' });
      return;
    }

    if (!userInfo) {
      navigate('/login?redirect=express-checkout');
      return;
    }

    // Simulate payment processing
    setProcessingPayment(true);
    setPaymentMessage({ text: 'Processing your payment...', type: 'info' });

    // Simulate API call to payment gateway
    setTimeout(() => {
      setProcessingPayment(false);

      // For demo purposes, always succeed
      setPaymentMessage({
        text: 'Payment successful! Redirecting to confirmation page...',
        type: 'success'
      });

      // Redirect to order confirmation after a delay
      setTimeout(() => {
        navigate('/placeorder?express=true&method=' + expressCheckoutMethod);
      }, 2000);
    }, 3000);
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.cartItemKey || item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.imageUrl} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    {/* Extract product ID safely */}
                    {(() => {
                      let productId = '';
                      if (item.product) {
                        if (typeof item.product === 'object' && item.product._id) {
                          productId = item.product._id;
                        } else if (typeof item.product === 'string') {
                          productId = item.product;
                        }
                      }
                      return (
                        <Link to={`/product/${productId}`}>{item.name}</Link>
                      );
                    })()}

                    {/* Display footwear size variations */}
                    {item.hasVariations && item.footwearSize && (
                      <div className="mt-2">
                        <Badge bg="info" className="me-2 p-2">
                          <FaShoePrints className="me-1" /> UK: {item.footwearSize.ukSize}
                        </Badge>
                        <Badge bg="secondary" className="p-2">
                          <FaShoePrints className="me-1" /> US: {item.footwearSize.usSize}
                        </Badge>
                      </div>
                    )}

                    {/* Display smartphone spec variations */}
                    {item.hasVariations && item.smartphoneSpec && (
                      <div className="mt-2">
                        <div className="mb-1">
                          <Badge bg="info" className="p-2">
                            <FaMobileAlt className="me-1" /> {item.smartphoneSpec.model}
                          </Badge>
                        </div>
                        <div className="d-flex">
                          <Badge bg="secondary" className="me-2 p-2">
                            <FaSdCard className="me-1" /> {item.smartphoneSpec.storage}
                          </Badge>
                          <Badge bg="secondary" className="p-2">
                            <FaMemory className="me-1" /> {item.smartphoneSpec.ram}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </Col>
                  <Col md={2}>₹{item.price.toLocaleString('en-IN')}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => {
                        // If item has variations, pass them along
                        if (item.hasVariations) {
                          if (item.footwearSize) {
                            addToCart(item.product, Number(e.target.value), {
                              hasVariations: true,
                              footwearSize: item.footwearSize
                            });
                          } else if (item.smartphoneSpec) {
                            addToCart(item.product, Number(e.target.value), {
                              hasVariations: true,
                              smartphoneSpec: item.smartphoneSpec
                            });
                          }
                        } else {
                          addToCart(item.product, Number(e.target.value));
                        }
                      }}
                    >
                      {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        // If item has a cartItemKey (for variations), use it
                        if (item.cartItemKey) {
                          removeFromCart(item.cartItemKey, true);
                        } else {
                          removeFromCart(item.product);
                        }
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card className="cart-summary shadow-sm">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="d-flex justify-content-between align-items-center">
                <span>Subtotal</span>
                <span className="text-primary">
                  ₹{cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toLocaleString('en-IN')}
                </span>
              </h2>
              <p className="text-muted mb-0">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)} items
              </p>
            </ListGroup.Item>

            {/* Payment Message */}
            {paymentMessage.text && (
              <ListGroup.Item>
                <Alert variant={paymentMessage.type} className="mb-0">
                  {processingPayment && (
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  {paymentMessage.text}
                </Alert>
              </ListGroup.Item>
            )}

            {/* Regular Checkout Button */}
            <ListGroup.Item>
              <Button
                type="button"
                variant="primary"
                className="w-100 py-2"
                disabled={cartItems.length === 0 || processingPayment}
                onClick={checkoutHandler}
              >
                Proceed To Checkout <FaArrowRight className="ms-2" />
              </Button>

              <div className="text-center my-3">
                <span className="text-muted">OR</span>
              </div>

              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() => setShowExpressCheckout(!showExpressCheckout)}
                disabled={cartItems.length === 0 || processingPayment}
              >
                Express Checkout
              </Button>
            </ListGroup.Item>

            {/* Express Checkout Options */}
            {showExpressCheckout && (
              <ListGroup.Item>
                <h5 className="mb-3">Choose Payment Method</h5>

                <div className="express-checkout-options">
                  {/* PayPal */}
                  <div
                    className={`payment-option mb-2 p-3 border rounded ${expressCheckoutMethod === 'paypal' ? 'border-primary' : ''}`}
                    onClick={() => setExpressCheckoutMethod('paypal')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="payment-icon me-3 text-primary">
                        <FaPaypal size={24} />
                      </div>
                      <div>
                        <h6 className="mb-0">PayPal</h6>
                        <small className="text-muted">Pay securely with PayPal</small>
                      </div>
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        className="ms-auto"
                        checked={expressCheckoutMethod === 'paypal'}
                        onChange={() => setExpressCheckoutMethod('paypal')}
                      />
                    </div>
                  </div>

                  {/* Credit/Debit Card */}
                  <div
                    className={`payment-option mb-2 p-3 border rounded ${expressCheckoutMethod === 'card' ? 'border-primary' : ''}`}
                    onClick={() => setExpressCheckoutMethod('card')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="payment-icon me-3 text-primary">
                        <FaCreditCard size={24} />
                      </div>
                      <div>
                        <h6 className="mb-0">Credit/Debit Card</h6>
                        <small className="text-muted">All major cards accepted</small>
                      </div>
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        className="ms-auto"
                        checked={expressCheckoutMethod === 'card'}
                        onChange={() => setExpressCheckoutMethod('card')}
                      />
                    </div>
                  </div>

                  {/* UPI */}
                  <div
                    className={`payment-option mb-2 p-3 border rounded ${expressCheckoutMethod === 'upi' ? 'border-primary' : ''}`}
                    onClick={() => setExpressCheckoutMethod('upi')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="payment-icon me-3 text-primary">
                        <FaUpi size={24} />
                      </div>
                      <div>
                        <h6 className="mb-0">UPI</h6>
                        <small className="text-muted">Google Pay, PhonePe, Paytm</small>
                      </div>
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        className="ms-auto"
                        checked={expressCheckoutMethod === 'upi'}
                        onChange={() => setExpressCheckoutMethod('upi')}
                      />
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className={`payment-option mb-2 p-3 border rounded ${expressCheckoutMethod === 'cod' ? 'border-primary' : ''}`}
                    onClick={() => setExpressCheckoutMethod('cod')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="payment-icon me-3 text-primary">
                        <FaMoneyBillWave size={24} />
                      </div>
                      <div>
                        <h6 className="mb-0">Cash on Delivery</h6>
                        <small className="text-muted">Pay when you receive</small>
                      </div>
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        className="ms-auto"
                        checked={expressCheckoutMethod === 'cod'}
                        onChange={() => setExpressCheckoutMethod('cod')}
                      />
                    </div>
                  </div>

                  <Button
                    variant="success"
                    className="w-100 mt-3"
                    onClick={expressCheckoutHandler}
                    disabled={!expressCheckoutMethod || processingPayment}
                  >
                    {processingPayment ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>

                <div className="secure-checkout-info mt-3 text-center">
                  <div className="d-flex justify-content-center align-items-center text-muted">
                    <FaLock className="me-2" size={14} />
                    <small>Secure Checkout</small>
                    <FaShieldAlt className="ms-2 me-1" size={14} />
                    <small>100% Purchase Protection</small>
                  </div>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
