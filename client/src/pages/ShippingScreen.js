import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ShippingScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const { saveShippingAddress } = useContext(CartContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchAddresses = async () => {
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };

          const { data } = await axios.get('/api/users/addresses', config);
          setAddresses(data);
          setLoading(false);

          // If there's a default address, select it
          const defaultAddress = data.find((addr) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress._id);
          } else if (data.length > 0) {
            setSelectedAddress(data[0]._id);
          }
        } catch (error) {
          setError(
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message
          );
          setLoading(false);
        }
      };

      fetchAddresses();
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    const address = addresses.find((addr) => addr._id === selectedAddress);
    if (address) {
      console.log('Selected address:', address);
      saveShippingAddress(address);
      console.log('Saved shipping address to context');
      navigate('/payment');
    } else {
      setError('Please select a valid address');
    }
  };

  return (
    <FormContainer>
      <h1>Shipping</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : addresses.length === 0 ? (
        <Message>
          You don't have any saved addresses.{' '}
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate('/addresses')}
          >
            Add an address
          </Button>
        </Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address" className="my-3">
            <Form.Label>Select Delivery Address</Form.Label>
            <Form.Control
              as="select"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              required
            >
              <option value="">Select an address</option>
              {addresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.fullName}, {address.addressLine}, {address.city},{' '}
                  {address.pinCode} - {address.phone}
                  {address.isDefault ? ' (Default)' : ''}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Row className="my-3">
            <Col>
              <Button
                variant="secondary"
                onClick={() => navigate('/addresses')}
              >
                Manage Addresses
              </Button>
            </Col>
            <Col className="text-end">
              <Button
                type="submit"
                variant="primary"
                disabled={!selectedAddress}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </FormContainer>
  );
};

export default ShippingScreen;
