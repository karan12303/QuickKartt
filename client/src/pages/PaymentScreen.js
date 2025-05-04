import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { FaCreditCard, FaPaypal, FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const { shippingAddress, savePaymentMethod } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  // Check if shipping address is set
  useEffect(() => {
    if (!shippingAddress.addressLine) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiId, setUpiId] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Save payment details based on method
    let paymentDetails = {};
    
    if (paymentMethod === 'card') {
      paymentDetails = {
        cardNumber,
        cardName,
        cardExpiry,
        cardCVV
      };
    } else if (paymentMethod === 'upi') {
      paymentDetails = {
        upiId
      };
    }
    
    // Save payment method and details to context
    savePaymentMethod({ method: paymentMethod, details: paymentDetails });
    
    // Navigate to place order screen
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Payment Method</Form.Label>
          <Row className="mb-3">
            <Col md={6}>
              <Card 
                className={`mb-3 ${paymentMethod === 'paypal' ? 'border-primary' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    label=""
                    id="PayPal"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="me-2"
                  />
                  <FaPaypal className="me-2 text-primary" size={24} />
                  <div>
                    <strong>PayPal</strong>
                    <p className="mb-0 small text-muted">Pay securely with PayPal</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card 
                className={`mb-3 ${paymentMethod === 'card' ? 'border-primary' : ''}`}
                onClick={() => setPaymentMethod('card')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    label=""
                    id="CreditCard"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="me-2"
                  />
                  <FaCreditCard className="me-2 text-primary" size={24} />
                  <div>
                    <strong>Credit/Debit Card</strong>
                    <p className="mb-0 small text-muted">Pay with Visa, Mastercard, etc.</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card 
                className={`mb-3 ${paymentMethod === 'upi' ? 'border-primary' : ''}`}
                onClick={() => setPaymentMethod('upi')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    label=""
                    id="UPI"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="me-2"
                  />
                  <FaMobileAlt className="me-2 text-primary" size={24} />
                  <div>
                    <strong>UPI</strong>
                    <p className="mb-0 small text-muted">Pay using UPI apps like Google Pay, PhonePe, etc.</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card 
                className={`mb-3 ${paymentMethod === 'cod' ? 'border-primary' : ''}`}
                onClick={() => setPaymentMethod('cod')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    label=""
                    id="COD"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="me-2"
                  />
                  <FaMoneyBillWave className="me-2 text-primary" size={24} />
                  <div>
                    <strong>Cash On Delivery</strong>
                    <p className="mb-0 small text-muted">Pay when you receive your order</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form.Group>

        {/* Additional fields based on payment method */}
        {paymentMethod === 'card' && (
          <div className="payment-details-section">
            <h4>Card Details</h4>
            <Form.Group controlId="cardNumber" className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="cardName" className="mb-3">
              <Form.Label>Name on Card</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="cardExpiry" className="mb-3">
                  <Form.Label>Expiry Date (MM/YY)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cardCVV" className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="payment-details-section">
            <h4>UPI Details</h4>
            <Form.Group controlId="upiId" className="mb-3">
              <Form.Label>UPI ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Enter your UPI ID (e.g., yourname@okicici, yourname@ybl)
              </Form.Text>
            </Form.Group>
          </div>
        )}

        <Button type="submit" variant="primary" className="mt-4">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
