import React, { useState } from 'react';
import { Container, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ClearStorageScreen = () => {
  const [cleared, setCleared] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const clearStorage = () => {
    // Clear localStorage
    localStorage.clear();
    setCleared(true);

    // Countdown and redirect
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(interval);
        navigate('/login');
      }
    }, 1000);
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-sm">
        <Card.Body className="text-center">
          <h2>QuickKart Storage Reset</h2>
          <p className="mb-4">
            If you're experiencing authentication issues, click the button below to clear your local storage and reset your session.
          </p>
          
          {cleared ? (
            <Alert variant="success">
              Storage cleared successfully! You will be redirected to the login page in {countdown} seconds.
            </Alert>
          ) : (
            <Button 
              variant="danger" 
              size="lg" 
              onClick={clearStorage}
              className="px-4"
            >
              Clear Local Storage
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClearStorageScreen;
