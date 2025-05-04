import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { FaCog, FaTshirt, FaShoePrints, FaMobileAlt, FaTrash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const UserPreferences = () => {
  const [show, setShow] = useState(false);
  const [preferences, setPreferences] = useState({
    clothingSizes: [],
    footwearSizes: [],
    smartphonePreferences: []
  });
  const [newClothingSize, setNewClothingSize] = useState('');
  const [newFootwearSize, setNewFootwearSize] = useState({ uk: '', us: '' });
  const [newSmartphonePreference, setNewSmartphonePreference] = useState({ brand: '', storage: '', ram: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { userInfo } = useContext(AuthContext);
  
  // Clothing size options
  const clothingSizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  
  // Footwear size options
  const footwearUKSizes = [6, 7, 8, 9, 10, 11, 12];
  const footwearUSSizes = [7, 8, 9, 10, 11, 12, 13];
  
  // Smartphone options
  const smartphoneBrands = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google', 'Realme', 'Oppo', 'Vivo'];
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
  const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB'];
  
  // Load user preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);
  
  // Save preferences to localStorage
  const savePreferences = (updatedPreferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    setPreferences(updatedPreferences);
    
    // Show success message
    setMessage({ text: 'Preferences saved successfully!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    
    // If user is logged in, save to server (this would be implemented in a real app)
    if (userInfo) {
      // This is a placeholder for server-side saving
      console.log('Saving preferences to server for user:', userInfo.name);
      // In a real implementation, you would make an API call here
    }
  };
  
  // Add clothing size
  const addClothingSize = () => {
    if (!newClothingSize) return;
    
    // Check if already exists
    if (preferences.clothingSizes.includes(newClothingSize)) {
      setMessage({ text: 'This size is already in your preferences', type: 'warning' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }
    
    const updatedPreferences = {
      ...preferences,
      clothingSizes: [...preferences.clothingSizes, newClothingSize]
    };
    
    savePreferences(updatedPreferences);
    setNewClothingSize('');
  };
  
  // Add footwear size
  const addFootwearSize = () => {
    if (!newFootwearSize.uk || !newFootwearSize.us) return;
    
    // Check if already exists
    const sizeExists = preferences.footwearSizes.some(
      size => size.uk === newFootwearSize.uk && size.us === newFootwearSize.us
    );
    
    if (sizeExists) {
      setMessage({ text: 'This size is already in your preferences', type: 'warning' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }
    
    const updatedPreferences = {
      ...preferences,
      footwearSizes: [...preferences.footwearSizes, newFootwearSize]
    };
    
    savePreferences(updatedPreferences);
    setNewFootwearSize({ uk: '', us: '' });
  };
  
  // Add smartphone preference
  const addSmartphonePreference = () => {
    if (!newSmartphonePreference.brand || !newSmartphonePreference.storage || !newSmartphonePreference.ram) return;
    
    // Check if already exists
    const prefExists = preferences.smartphonePreferences.some(
      pref => 
        pref.brand === newSmartphonePreference.brand && 
        pref.storage === newSmartphonePreference.storage && 
        pref.ram === newSmartphonePreference.ram
    );
    
    if (prefExists) {
      setMessage({ text: 'This preference is already saved', type: 'warning' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }
    
    const updatedPreferences = {
      ...preferences,
      smartphonePreferences: [...preferences.smartphonePreferences, newSmartphonePreference]
    };
    
    savePreferences(updatedPreferences);
    setNewSmartphonePreference({ brand: '', storage: '', ram: '' });
  };
  
  // Remove clothing size
  const removeClothingSize = (size) => {
    const updatedPreferences = {
      ...preferences,
      clothingSizes: preferences.clothingSizes.filter(s => s !== size)
    };
    
    savePreferences(updatedPreferences);
  };
  
  // Remove footwear size
  const removeFootwearSize = (index) => {
    const updatedPreferences = {
      ...preferences,
      footwearSizes: preferences.footwearSizes.filter((_, i) => i !== index)
    };
    
    savePreferences(updatedPreferences);
  };
  
  // Remove smartphone preference
  const removeSmartphonePreference = (index) => {
    const updatedPreferences = {
      ...preferences,
      smartphonePreferences: preferences.smartphonePreferences.filter((_, i) => i !== index)
    };
    
    savePreferences(updatedPreferences);
  };
  
  // Handle modal open/close
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
    <>
      <Button 
        variant="outline-primary" 
        size="sm" 
        onClick={handleShow}
        className="d-flex align-items-center"
      >
        <FaCog className="me-2" /> My Preferences
      </Button>
      
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>My Shopping Preferences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}
          
          <p className="text-muted mb-4">
            Save your preferences to make shopping easier. We'll use these to recommend products and pre-select options.
          </p>
          
          {/* Clothing Sizes */}
          <h5 className="d-flex align-items-center mb-3">
            <FaTshirt className="me-2" /> Clothing Sizes
          </h5>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Add Clothing Size</Form.Label>
                <div className="d-flex">
                  <Form.Select
                    value={newClothingSize}
                    onChange={(e) => setNewClothingSize(e.target.value)}
                    className="me-2"
                  >
                    <option value="">Select Size</option>
                    {clothingSizeOptions.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </Form.Select>
                  <Button 
                    variant="primary" 
                    onClick={addClothingSize}
                    disabled={!newClothingSize}
                  >
                    Add
                  </Button>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Label>Your Saved Sizes</Form.Label>
              <div className="d-flex flex-wrap">
                {preferences.clothingSizes.length === 0 ? (
                  <p className="text-muted">No sizes saved yet</p>
                ) : (
                  preferences.clothingSizes.map((size, index) => (
                    <Badge 
                      key={index} 
                      bg="light" 
                      text="dark" 
                      className="me-2 mb-2 p-2 d-flex align-items-center"
                    >
                      {size}
                      <Button 
                        variant="link" 
                        className="p-0 ms-2 text-danger" 
                        onClick={() => removeClothingSize(size)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        <FaTrash />
                      </Button>
                    </Badge>
                  ))
                )}
              </div>
            </Col>
          </Row>
          
          {/* Footwear Sizes */}
          <h5 className="d-flex align-items-center mb-3">
            <FaShoePrints className="me-2" /> Footwear Sizes
          </h5>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Add Footwear Size</Form.Label>
                <Row>
                  <Col>
                    <Form.Select
                      value={newFootwearSize.uk}
                      onChange={(e) => setNewFootwearSize({...newFootwearSize, uk: e.target.value})}
                      className="mb-2"
                    >
                      <option value="">UK Size</option>
                      {footwearUKSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Select
                      value={newFootwearSize.us}
                      onChange={(e) => setNewFootwearSize({...newFootwearSize, us: e.target.value})}
                      className="mb-2"
                    >
                      <option value="">US Size</option>
                      {footwearUSSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
                <Button 
                  variant="primary" 
                  onClick={addFootwearSize}
                  disabled={!newFootwearSize.uk || !newFootwearSize.us}
                  className="w-100"
                >
                  Add Size
                </Button>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Label>Your Saved Sizes</Form.Label>
              {preferences.footwearSizes.length === 0 ? (
                <p className="text-muted">No sizes saved yet</p>
              ) : (
                <ListGroup>
                  {preferences.footwearSizes.map((size, index) => (
                    <ListGroup.Item 
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <Badge bg="primary" className="me-2">UK: {size.uk}</Badge>
                        <Badge bg="secondary">US: {size.us}</Badge>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-danger p-0" 
                        onClick={() => removeFootwearSize(index)}
                      >
                        <FaTrash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
          </Row>
          
          {/* Smartphone Preferences */}
          <h5 className="d-flex align-items-center mb-3">
            <FaMobileAlt className="me-2" /> Smartphone Preferences
          </h5>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Add Smartphone Preference</Form.Label>
                <Form.Select
                  value={newSmartphonePreference.brand}
                  onChange={(e) => setNewSmartphonePreference({...newSmartphonePreference, brand: e.target.value})}
                  className="mb-2"
                >
                  <option value="">Select Brand</option>
                  {smartphoneBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </Form.Select>
                <Row>
                  <Col>
                    <Form.Select
                      value={newSmartphonePreference.storage}
                      onChange={(e) => setNewSmartphonePreference({...newSmartphonePreference, storage: e.target.value})}
                      className="mb-2"
                    >
                      <option value="">Storage</option>
                      {storageOptions.map((storage) => (
                        <option key={storage} value={storage}>{storage}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Select
                      value={newSmartphonePreference.ram}
                      onChange={(e) => setNewSmartphonePreference({...newSmartphonePreference, ram: e.target.value})}
                      className="mb-2"
                    >
                      <option value="">RAM</option>
                      {ramOptions.map((ram) => (
                        <option key={ram} value={ram}>{ram}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
                <Button 
                  variant="primary" 
                  onClick={addSmartphonePreference}
                  disabled={!newSmartphonePreference.brand || !newSmartphonePreference.storage || !newSmartphonePreference.ram}
                  className="w-100"
                >
                  Add Preference
                </Button>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Label>Your Saved Preferences</Form.Label>
              {preferences.smartphonePreferences.length === 0 ? (
                <p className="text-muted">No preferences saved yet</p>
              ) : (
                <ListGroup>
                  {preferences.smartphonePreferences.map((pref, index) => (
                    <ListGroup.Item 
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-bold">{pref.brand}</div>
                        <div>
                          <Badge bg="info" className="me-2">{pref.storage}</Badge>
                          <Badge bg="secondary">{pref.ram}</Badge>
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-danger p-0" 
                        onClick={() => removeSmartphonePreference(index)}
                      >
                        <FaTrash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserPreferences;
