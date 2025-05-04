import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import PayPalButton from '../components/PayPalButton';

const PayPalTest = () => {
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Check if PayPal is loaded
  useEffect(() => {
    const checkPayPalLoaded = () => {
      if (window.paypal && window.paypal.Buttons) {
        console.log('PayPal SDK detected in window object');
        setPaypalLoaded(true);
      } else {
        console.log('PayPal SDK not detected yet');
        setPaypalLoaded(false);
      }
    };

    checkPayPalLoaded();

    // Check again after a delay in case it loads later
    const timer = setTimeout(checkPayPalLoaded, 2000);

    return () => clearTimeout(timer);
  }, [retryCount]);

  const handleSuccess = (result) => {
    console.log('Payment successful:', result);
    setPaymentResult(result);
    setError(null);
  };

  const handleError = (err) => {
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

    setError(errorMessage);
    setPaymentResult(null);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h2" className="text-center">
              PayPal Integration Test
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger">
                  <h5>Error:</h5>
                  <p>{error}</p>
                </Alert>
              )}

              {paymentResult && (
                <Alert variant="success">
                  <h5>Payment Successful!</h5>
                  <p>Transaction ID: {paymentResult.id}</p>
                  <p>Status: {paymentResult.status}</p>
                  <p>Time: {paymentResult.update_time}</p>
                  <p>Email: {paymentResult.email_address}</p>
                </Alert>
              )}

              <div className="mb-4">
                <h4>Test Payment: $10 USD</h4>
                <p>
                  This is a test payment to verify that the PayPal integration is working correctly.
                  No actual charges will be made. Using USD currency as PayPal sandbox doesn't support INR.
                </p>
              </div>

              <div className="mt-4">
                {!paypalLoaded && retryCount < 3 ? (
                  <div className="text-center">
                    <Alert variant="warning">
                      <p>PayPal is still loading. Please wait...</p>
                    </Alert>
                  </div>
                ) : !paypalLoaded ? (
                  <div className="text-center">
                    <Alert variant="danger">
                      <p>Failed to load PayPal. Please try refreshing the page.</p>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setError(null);
                          setRetryCount(retryCount + 1);
                        }}
                      >
                        Retry Loading PayPal
                      </Button>
                    </Alert>
                  </div>
                ) : (
                  <div className="paypal-button-container">
                    <PayPalButton
                      amount={10}
                      orderId={`test-order-id-${Date.now()}`}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  </div>
                )}
              </div>
            </Card.Body>
            <Card.Footer className="text-muted text-center">
              <small>
                Using PayPal Sandbox mode. No real payments will be processed.
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PayPalTest;
