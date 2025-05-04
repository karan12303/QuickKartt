import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Alert, Nav, Tab } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import OTPLoginForm from '../components/OTPLoginForm';

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading, error, login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [activeTab, setActiveTab] = useState('email');

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    // Check if user was redirected due to expired token
    if (location.search.includes('expired=true')) {
      setSessionExpired(true);
    }

    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect, location.search]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleLoginSuccess = () => {
    navigate(redirect);
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {sessionExpired && (
        <Alert variant="warning">
          Your session has expired. Please log in again to continue.
        </Alert>
      )}

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="email">Email & Password</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="mobile">Mobile & OTP</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="email">
            {error && activeTab === 'email' && <Message variant="danger">{error}</Message>}
            {loading && activeTab === 'email' && <Loader />}

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="email" className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="my-3">
                Sign In
              </Button>
            </Form>
          </Tab.Pane>

          <Tab.Pane eventKey="mobile">
            <OTPLoginForm onLoginSuccess={handleLoginSuccess} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <Row className="py-3">
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
