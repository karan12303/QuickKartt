import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { FaBell, FaInfoCircle, FaCheck } from 'react-icons/fa';

const SmsNotificationSettings = ({ userPhone, onSave }) => {
  const [phone, setPhone] = useState(userPhone || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [orderStatusUpdates, setOrderStatusUpdates] = useState(true);
  const [deliveryUpdates, setDeliveryUpdates] = useState(true);
  const [promotionalMessages, setPromotionalMessages] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create notification preferences object
    const notificationPreferences = {
      phone,
      enabled: notificationsEnabled,
      orderStatusUpdates,
      deliveryUpdates,
      promotionalMessages
    };
    
    // Call the onSave function with the preferences
    onSave(notificationPreferences);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-light">
        <h5 className="mb-0 d-flex align-items-center">
          <FaBell className="me-2 text-primary" /> SMS Notification Settings
        </h5>
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" className="d-flex align-items-center">
            <FaCheck className="me-2" /> Notification preferences saved successfully!
          </Alert>
        )}
        
        <p className="text-muted mb-3">
          <FaInfoCircle className="me-2" /> 
          Receive SMS notifications about your orders and account activity.
        </p>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              We'll use this number to send you order updates.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="enable-notifications"
              label="Enable SMS Notifications"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
          </Form.Group>
          
          <div className="ms-4">
            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                id="order-status-updates"
                label="Order Status Updates"
                checked={orderStatusUpdates}
                onChange={(e) => setOrderStatusUpdates(e.target.checked)}
                disabled={!notificationsEnabled}
              />
              <Form.Text className="text-muted ms-4">
                Receive updates when your order status changes
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                id="delivery-updates"
                label="Delivery Updates"
                checked={deliveryUpdates}
                onChange={(e) => setDeliveryUpdates(e.target.checked)}
                disabled={!notificationsEnabled}
              />
              <Form.Text className="text-muted ms-4">
                Receive updates about your order delivery
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="promotional-messages"
                label="Promotional Messages"
                checked={promotionalMessages}
                onChange={(e) => setPromotionalMessages(e.target.checked)}
                disabled={!notificationsEnabled}
              />
              <Form.Text className="text-muted ms-4">
                Receive promotional offers and discounts
              </Form.Text>
            </Form.Group>
          </div>
          
          <div className="mt-3">
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>
        </Form>
        
        <div className="mt-4">
          <h6>Free SMS Notification Services</h6>
          <p className="text-muted small">
            For implementing SMS notifications in your e-commerce application, consider these free options:
          </p>
          <ul className="small">
            <li><strong>Twilio Free Trial:</strong> Offers $15 credit for testing SMS functionality.</li>
            <li><strong>TextLocal:</strong> Provides free SMS credits for testing purposes.</li>
            <li><strong>Fast2SMS:</strong> Offers free SMS API for developers in India.</li>
            <li><strong>MSG91:</strong> Provides free trial credits for SMS integration.</li>
            <li><strong>Firebase Phone Authentication:</strong> Can be used for verification and simple notifications.</li>
          </ul>
          <p className="text-muted small">
            These services offer developer-friendly APIs that can be easily integrated with your Node.js backend.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SmsNotificationSettings;
