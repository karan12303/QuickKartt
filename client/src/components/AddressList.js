import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, ListGroup, Row, Col, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddressList = () => {
  const { userInfo } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
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
            : 'Failed to fetch addresses'
        );
        setLoading(false);
      }
    };

    if (userInfo && userInfo.token) {
      fetchAddresses();
    }
  }, [userInfo]);

  const handleSetDefault = async (addressId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/users/addresses/${addressId}/default`,
        {},
        config
      );

      // Update addresses list with new default
      setAddresses(
        addresses.map((address) => ({
          ...address,
          isDefault: address._id === addressId,
        }))
      );

      setSuccessMessage('Default address updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to set default address'
      );
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        await axios.delete(`/api/users/addresses/${addressId}`, config);

        // Remove deleted address from state
        setAddresses(addresses.filter((address) => address._id !== addressId));

        setSuccessMessage('Address deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to delete address'
        );
      }
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0 d-flex align-items-center">
          <FaMapMarkerAlt className="me-2 text-primary" /> My Addresses
        </h5>
        <Link to="/address/new">
          <Button variant="primary" size="sm">
            <FaPlus className="me-1" /> Add New Address
          </Button>
        </Link>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-4">
            <p className="mb-3">You don't have any saved addresses yet.</p>
            <Link to="/address/new">
              <Button variant="primary">
                <FaPlus className="me-1" /> Add New Address
              </Button>
            </Link>
          </div>
        ) : (
          <ListGroup variant="flush">
            {addresses.map((address) => (
              <ListGroup.Item key={address._id} className="py-3">
                <Row>
                  <Col md={8}>
                    <div className="d-flex align-items-start">
                      <div className="me-3 mt-1">
                        <FaMapMarkerAlt size={20} className="text-primary" />
                      </div>
                      <div>
                        <h6 className="mb-1">{address.fullName}</h6>
                        <p className="mb-1">
                          {address.addressLine}, {address.city}, {address.pinCode}
                        </p>
                        <p className="mb-1">Phone: {address.phone}</p>
                        {address.isDefault && (
                          <Badge bg="success" className="mt-1">
                            Default Address
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="d-flex align-items-center justify-content-end">
                    <div className="d-flex">
                      {!address.isDefault && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleSetDefault(address._id)}
                          title="Set as Default"
                        >
                          <FaCheck />
                        </Button>
                      )}
                      <Link
                        to={`/address/${address._id}/edit`}
                        className="btn btn-outline-primary btn-sm me-2"
                        title="Edit Address"
                      >
                        <FaEdit />
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteAddress(address._id)}
                        title="Delete Address"
                        disabled={address.isDefault}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default AddressList;
