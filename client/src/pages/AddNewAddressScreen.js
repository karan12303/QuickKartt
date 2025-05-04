import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const AddNewAddressScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const autocompleteRef = useRef(null);

  // Load Google Maps API with hardcoded key
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyANc2hhFmQUI3hPHjvGflnft-_RypdVXTI',
    libraries: ['places'],
  });

  const [fullName, setFullName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug authentication
  React.useEffect(() => {
    console.log('User info in AddNewAddressScreen:', userInfo);
    if (!userInfo) {
      console.log('No user info, redirecting to login');
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // Handle place selection from Google Maps autocomplete
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place && place.address_components) {
        // Extract address components
        let streetNumber = '';
        let route = '';
        let locality = '';
        let postalCode = '';
        
        for (const component of place.address_components) {
          const componentType = component.types[0];
          
          switch (componentType) {
            case 'street_number':
              streetNumber = component.long_name;
              break;
            case 'route':
              route = component.long_name;
              break;
            case 'locality':
              locality = component.long_name;
              setCity(locality);
              break;
            case 'postal_code':
              postalCode = component.long_name;
              setPinCode(postalCode);
              break;
            default:
              break;
          }
        }
        
        // Set address line (combine street number and route)
        if (streetNumber && route) {
          setAddressLine(`${streetNumber} ${route}`);
        } else if (place.formatted_address) {
          setAddressLine(place.formatted_address);
        }
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('Form submitted in AddNewAddressScreen');
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const addressData = {
        fullName,
        addressLine,
        city,
        pinCode,
        phone,
        isDefault,
      };

      console.log('Address data:', addressData);

      const response = await axios.post('/api/users/addresses', addressData, config);
      console.log('Response:', response.data);

      setLoading(false);
      console.log('Navigating to /addresses');
      navigate('/addresses');
    } catch (error) {
      console.error('Error submitting form:', error);
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
      <Link to="/addresses" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Add New Address</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="fullName" className="my-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="addressLine" className="my-3">
              <Form.Label>Address Line</Form.Label>
              {isLoaded ? (
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={onPlaceChanged}
                  restrictions={{ country: 'in' }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter address line (start typing for suggestions)"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    required
                  />
                </Autocomplete>
              ) : (
                <Form.Control
                  type="text"
                  placeholder="Enter address line"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  required
                />
              )}
            </Form.Group>

            <Form.Group controlId="city" className="my-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="pinCode" className="my-3">
              <Form.Label>PIN Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter PIN code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="phone" className="my-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="isDefault" className="my-3">
              <Form.Check
                type="checkbox"
                label="Set as default address"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-3">
              Add Address
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default AddNewAddressScreen;
