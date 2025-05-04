import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddressList from '../components/AddressList';
import SmsNotificationSettings from '../components/SmsNotificationSettings';
import { FaUser, FaLock, FaBell, FaMapMarkerAlt } from 'react-icons/fa';

const ProfilePage = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        config
      );

      setUserInfo({
        ...userInfo,
        name: data.name,
        email: data.email,
      });

      localStorage.setItem('userInfo', JSON.stringify({
        ...userInfo,
        name: data.name,
        email: data.email,
      }));

      setSuccessMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'An error occurred. Please try again.'
      );
      setLoading(false);
    }
  };

  const handleSaveNotificationPreferences = async (preferences) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('/api/notifications/preferences', preferences, config);

      // Update user info with notification preferences
      setUserInfo({
        ...userInfo,
        notificationPreferences: preferences,
      });

      localStorage.setItem('userInfo', JSON.stringify({
        ...userInfo,
        notificationPreferences: preferences,
      }));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      setMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to save notification preferences. Please try again.'
      );
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={3}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <div
                  className="avatar-placeholder rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#f0f0f0',
                    fontSize: '2rem',
                    color: '#666'
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
                <h5>{name}</h5>
                <p className="text-muted">{email}</p>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant={activeTab === 'profile' ? 'primary' : 'outline-secondary'}
                  className="text-start d-flex align-items-center"
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser className="me-2" /> Profile
                </Button>
                <Button
                  variant={activeTab === 'security' ? 'primary' : 'outline-secondary'}
                  className="text-start d-flex align-items-center"
                  onClick={() => setActiveTab('security')}
                >
                  <FaLock className="me-2" /> Security
                </Button>
                <Button
                  variant={activeTab === 'addresses' ? 'primary' : 'outline-secondary'}
                  className="text-start d-flex align-items-center"
                  onClick={() => setActiveTab('addresses')}
                >
                  <FaMapMarkerAlt className="me-2" /> Addresses
                </Button>
                <Button
                  variant={activeTab === 'notifications' ? 'primary' : 'outline-secondary'}
                  className="text-start d-flex align-items-center"
                  onClick={() => setActiveTab('notifications')}
                >
                  <FaBell className="me-2" /> Notifications
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {message && <Alert variant="danger">{message}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          {activeTab === 'profile' && (
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Profile Information</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Security Settings</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'addresses' && (
            <AddressList />
          )}

          {activeTab === 'notifications' && (
            <SmsNotificationSettings
              userPhone={userInfo?.notificationPreferences?.phone || ''}
              onSave={handleSaveNotificationPreferences}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
