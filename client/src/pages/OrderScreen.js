import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { FaCreditCard, FaPaypal, FaMobileAlt, FaMoneyBillWave, FaShoePrints, FaSdCard, FaMemory, FaImages } from 'react-icons/fa';
import PayPalButton from '../components/PayPalButton';
import UPIPayment from '../components/UPIPayment';
import CardPayment from '../components/CardPayment';
import SharePurchase from '../components/SharePurchase';
import OrderImagesView from '../components/OrderImagesView';

const OrderScreen = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Helper function to render payment method icon
  const renderPaymentIcon = (paymentMethod) => {
    if (!paymentMethod) return null;

    switch (paymentMethod) {
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
  const getPaymentMethodName = (paymentMethod) => {
    if (!paymentMethod) return 'Not Selected';

    switch (paymentMethod) {
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

  // Handle successful payment
  const handlePaymentSuccess = async (paymentResult) => {
    try {
      setPaymentError('');
      console.log('Payment successful:', paymentResult);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Make a real API call to update the order payment status
      // Using the user-pay endpoint which doesn't require admin privileges
      const { data } = await axios.put(
        `/api/orders/${id}/user-pay`,
        {
          isPaid: true,
          paymentResult: {
            ...paymentResult,
            // Add payment method information
            paymentMethod: 'paypal',
            // Add a note about the unique invoice ID to help with debugging
            notes: `Payment processed via PayPal with unique invoice ID to prevent duplicates`
          }
        },
        config
      );

      console.log('Order payment status updated:', data);

      // Update the order with the response data
      setOrder(data);
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Error updating payment status:', error);
      setPaymentError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  // Handle payment error
  const handlePaymentError = (err) => {
    console.error('Payment error:', err);

    // Handle different error types
    let errorMessage;
    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'object') {
      errorMessage = JSON.stringify(err);
    } else {
      errorMessage = 'An unknown error occurred';
    }

    setPaymentError(errorMessage);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    if (!userInfo) {
      setError('Please login to view this order');
      setLoading(false);
    } else {
      fetchOrder();
    }
  }, [id, userInfo]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order.orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.shippingAddress.fullName}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.addressLine}, {order.shippingAddress.city}
                , {order.shippingAddress.pinCode}
              </p>
              <p>
                <strong>Phone: </strong>
                {order.shippingAddress.phone}
              </p>
              <p>
                <strong>Status: </strong>
                <Badge
                  bg={
                    order.status === 'delivered'
                      ? 'success'
                      : order.status === 'shipped'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>
              <p className="d-flex align-items-center">
                <strong>Method: </strong>
                <span className="ms-2 d-flex align-items-center">
                  {renderPaymentIcon(order.paymentMethod)}
                  <span className="ms-2">{getPaymentMethodName(order.paymentMethod)}</span>
                </span>
              </p>
              <p>
                <strong>Payment Status: </strong>
                <Badge bg={order.isPaid ? 'success' : 'danger'}>
                  {order.isPaid ? 'Paid' : 'Not Paid'}
                </Badge>
              </p>
              {order.isPaid && (
                <>
                  <p>
                    <strong>Paid On: </strong>
                    {new Date(order.paidAt).toLocaleString()}
                  </p>
                  {order.paymentResult && order.paymentResult.paymentMethod && (
                    <p>
                      <strong>Paid Via: </strong>
                      {order.paymentResult.paymentMethod === 'paypal' ? 'PayPal' :
                       order.paymentResult.paymentMethod === 'card' ? 'Credit/Debit Card' :
                       order.paymentResult.paymentMethod === 'upi' ? 'UPI' :
                       order.paymentResult.paymentMethod}
                    </p>
                  )}
                </>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          {/* Use the productId field if available, otherwise extract from product */}
                          {(() => {
                            let productId = '';
                            // First check for the new productId field
                            if (item.productId) {
                              productId = item.productId;
                            }
                            // Fall back to extracting from product if needed
                            else if (item.product) {
                              if (typeof item.product === 'object' && item.product._id) {
                                productId = item.product._id;
                              } else if (typeof item.product === 'string') {
                                productId = item.product;
                              }
                            }

                            if (!productId) {
                              return <span>{item.name}</span>;
                            }

                            return (
                              <Link to={`/product/${productId}`}>
                                {item.name}
                              </Link>
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
                        <Col md={4}>
                          {item.qty} x ₹{item.price.toLocaleString('en-IN')} = ₹
                          {(item.qty * item.price).toLocaleString('en-IN')}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{order.totalPrice.toLocaleString('en-IN')}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && order.paymentMethod !== 'cod' ? (
                <ListGroup.Item>
                  <h2 className="mb-3">Complete Payment</h2>

                  {paymentSuccess ? (
                    <div>
                      <Message variant="success">
                        Payment successful! Thank you for your order. Your payment has been processed and the order is now marked as paid.
                      </Message>
                      <div className="d-grid gap-2 mt-3">
                        <Button
                          variant="primary"
                          onClick={() => navigate('/profile')}
                        >
                          Go Back to My Orders
                        </Button>
                      </div>
                    </div>
                  ) : paymentError ? (
                    <Message variant="danger">{paymentError}</Message>
                  ) : (
                    <>
                      {order.paymentMethod === 'paypal' && (
                        <>
                          <div className="alert alert-info mb-3">
                            <small>Note: PayPal payments are processed in USD. Amount shown is approximate.</small>
                          </div>
                          {/* Convert INR to USD (approximate) */}
                          <PayPalButton
                            amount={(order.totalPrice / 83).toFixed(2)}
                            orderId={order._id}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                          />
                        </>
                      )}

                      {order.paymentMethod === 'upi' && (
                        <UPIPayment
                          amount={order.totalPrice}
                          upiId="customer@upi"
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      )}

                      {order.paymentMethod === 'card' && (
                        <CardPayment
                          amount={order.totalPrice}
                          cardDetails={{}}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      )}
                    </>
                  )}
                </ListGroup.Item>
              ) : order.isPaid ? (
                <ListGroup.Item>
                  <div className="d-grid gap-2 mt-2">
                    <Button
                      variant="primary"
                      onClick={() => navigate('/profile')}
                    >
                      Go Back to My Orders
                    </Button>
                  </div>
                </ListGroup.Item>
              ) : null}

              {order.paymentMethod === 'cod' && !order.isPaid && (
                <ListGroup.Item>
                  <Message variant="info">
                    This order will be paid on delivery. Please keep the exact amount ready.
                  </Message>
                  <div className="d-grid gap-2 mt-3">
                    <Button
                      variant="primary"
                      onClick={() => navigate('/profile')}
                    >
                      Go Back to My Orders
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* Share Purchase Component - Only show for paid orders or COD orders */}
          {(order.isPaid || order.paymentMethod === 'cod') && (
            <div className="mt-4">
              <SharePurchase order={order} />
            </div>
          )}
        </Col>
      </Row>

      {/* Order Images Section */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header className="bg-primary text-white d-flex align-items-center">
              <FaImages className="me-2" />
              <h3 className="mb-0">Order Images</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-4">
                View images related to this order. You can add images from the Order History page.
              </p>
              <OrderImagesView orderId={id} userToken={userInfo?.token} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
