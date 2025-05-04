import React, { useState } from 'react';
import { Button, Form, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { FaCreditCard, FaLock } from 'react-icons/fa';

// This is a mock credit card payment component
// In a real application, you would integrate with a payment gateway like Stripe

const CardPayment = ({ amount, cardDetails, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState(cardDetails?.cardNumber || '');
  const [cardName, setCardName] = useState(cardDetails?.cardName || '');
  const [cardExpiry, setCardExpiry] = useState(cardDetails?.cardExpiry || '');
  const [cardCVV, setCardCVV] = useState('');

  const handlePayment = () => {
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
      alert('Please fill in all card details');
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      
      // Generate a mock transaction ID
      const transactionId = 'CARD-' + Math.random().toString(36).substring(2, 15);
      
      // Call the success callback with payment details
      onSuccess({
        id: transactionId,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: 'customer@example.com',
      });
    }, 2000);
  };

  return (
    <>
      <Button
        variant="primary"
        className="w-100 d-flex align-items-center justify-content-center"
        onClick={handlePayment}
      >
        <FaCreditCard className="me-2" />
        Pay with Card
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Card Payment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <p className="mb-3">Amount: ₹{amount.toLocaleString('en-IN')}</p>
            
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
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
                <Form.Group className="mb-3">
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
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="123"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex align-items-center text-muted mb-2">
              <FaLock className="me-2" />
              <small>Your payment information is secure and encrypted</small>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CardPayment;
