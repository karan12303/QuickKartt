import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import Loader from '../components/Loader';

const AddressListScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchAddresses();
    }
  }, [navigate, userInfo, success]);

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
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        await axios.delete(`/api/users/addresses/${id}`, config);
        setSuccess(true);
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    }
  };

  const setDefaultHandler = async (id) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const address = addresses.find((addr) => addr._id === id);
      if (address) {
        await axios.put(
          `/api/users/addresses/${id}`,
          { ...address, isDefault: true },
          config
        );
        setSuccess(!success); // Toggle to trigger useEffect
        setLoading(false);
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

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>My Addresses</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={() => {
            console.log('Navigating to /address/new');
            navigate('/address/new');
          }}>
            <FaPlus /> Add New Address
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : addresses.length === 0 ? (
        <Message>
          You don't have any saved addresses.{' '}
          <Link to="/address/new" onClick={() => console.log('Link clicked to /address/new')}>Add your first address</Link>
        </Message>
      ) : (
        <Row>
          {addresses.map((address) => (
            <Col key={address._id} md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    {address.fullName}{' '}
                    {address.isDefault && (
                      <span className="badge bg-success">Default</span>
                    )}
                  </Card.Title>
                  <Card.Text>
                    {address.addressLine}
                    <br />
                    {address.city}, {address.pinCode}
                    <br />
                    Phone: {address.phone}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Button
                        variant="light"
                        className="btn-sm me-2"
                        onClick={() => navigate(`/address/${address._id}/edit`)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(address._id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </div>
                    {!address.isDefault && (
                      <Button
                        variant="outline-success"
                        className="btn-sm"
                        onClick={() => setDefaultHandler(address._id)}
                      >
                        <FaCheck /> Set as Default
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default AddressListScreen;
