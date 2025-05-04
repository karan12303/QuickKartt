import React, { useState } from 'react';
import { Button, Form, Spinner, Modal, Image } from 'react-bootstrap';
import { FaMobileAlt } from 'react-icons/fa';

// This is a mock UPI payment component
// In a real application, you would integrate with a UPI payment gateway

const UPIPayment = ({ amount, upiId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handlePayment = () => {
    setShowQRModal(true);
  };

  const handleVerifyPayment = () => {
    if (!transactionId.trim()) {
      alert('Please enter a transaction ID');
      return;
    }

    setLoading(true);
    
    // Simulate payment verification
    setTimeout(() => {
      setLoading(false);
      setShowQRModal(false);
      
      // Call the success callback with payment details
      onSuccess({
        id: transactionId,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: upiId,
      });
    }, 1500);
  };

  return (
    <>
      <Button
        variant="primary"
        className="w-100 d-flex align-items-center justify-content-center"
        onClick={handlePayment}
      >
        <FaMobileAlt className="me-2" />
        Pay with UPI
      </Button>

      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>UPI Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Scan this QR code with any UPI app to pay ₹{amount.toLocaleString('en-IN')}</p>
          
          {/* Placeholder QR code image */}
          <div className="bg-light p-4 mb-3 d-inline-block">
            <Image 
              src="https://via.placeholder.com/200x200?text=UPI+QR+Code" 
              alt="UPI QR Code"
              fluid
            />
          </div>
          
          <p className="mb-1">Or pay using UPI ID:</p>
          <h5 className="mb-3">merchant@upi</h5>
          
          <Form.Group className="mb-3">
            <Form.Label>Enter UPI Transaction ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., UPI123456789"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              Enter the transaction ID from your UPI app after payment
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleVerifyPayment}
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
                Verifying...
              </>
            ) : (
              'Verify Payment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UPIPayment;
