import React, { useState } from 'react';
import { Card, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaShareAlt,
  FaCheck
} from 'react-icons/fa';

const SharePurchase = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const [shared, setShared] = useState(false);
  
  // Default share message
  const defaultMessage = `I just purchased from QuickKart! Check out these amazing products:`;
  
  const handleOpenModal = () => {
    setShowModal(true);
    setShareMessage(defaultMessage);
    setSelectedItems(order.orderItems.map(item => item._id));
  };
  
  const handleItemSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  
  const handleShare = (platform) => {
    // Get selected items
    const items = order.orderItems.filter(item => 
      selectedItems.includes(item._id)
    );
    
    // Create share text
    const itemsList = items.map(item => 
      `${item.name} - ₹${item.price.toLocaleString('en-IN')}`
    ).join('\n• ');
    
    const shareText = `${shareMessage}\n\n• ${itemsList}\n\nShop now at QuickKart!`;
    const encodedText = encodeURIComponent(shareText);
    const websiteUrl = encodeURIComponent('https://quickkart.com');
    
    // Share URLs
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${websiteUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${websiteUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Check out my purchase from QuickKart&body=${encodedText}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShared(true);
      
      // Reset shared status after 3 seconds
      setTimeout(() => {
        setShared(false);
      }, 3000);
    }
  };
  
  return (
    <>
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <FaShareAlt className="me-2 text-primary" /> Share Your Purchase
          </h5>
        </Card.Header>
        <Card.Body>
          <p>
            Share your purchase with friends and family on social media!
          </p>
          <Button
            variant="primary"
            onClick={handleOpenModal}
            className="d-flex align-items-center"
          >
            <FaShareAlt className="me-2" /> Share What You Bought
          </Button>
        </Card.Body>
      </Card>
      
      {/* Share Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Your Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {shared && (
            <div className="alert alert-success d-flex align-items-center mb-3">
              <FaCheck className="me-2" /> Successfully shared your purchase!
            </div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Your Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Select Items to Share</Form.Label>
            <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {order.orderItems.map((item) => (
                <div key={item._id} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`item-${item._id}`}
                    label={
                      <div className="d-flex align-items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="me-2 rounded"
                        />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-muted small">₹{item.price.toLocaleString('en-IN')} × {item.qty}</div>
                        </div>
                      </div>
                    }
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleItemSelection(item._id)}
                  />
                </div>
              ))}
            </div>
          </Form.Group>
          
          <div className="mt-4">
            <h6>Share on:</h6>
            <Row className="mt-3">
              <Col xs={6} md={3} className="mb-2">
                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => handleShare('facebook')}
                  disabled={selectedItems.length === 0}
                >
                  <FaFacebook className="me-2" /> Facebook
                </Button>
              </Col>
              <Col xs={6} md={3} className="mb-2">
                <Button
                  variant="outline-info"
                  className="w-100"
                  onClick={() => handleShare('twitter')}
                  disabled={selectedItems.length === 0}
                >
                  <FaTwitter className="me-2" /> Twitter
                </Button>
              </Col>
              <Col xs={6} md={3} className="mb-2">
                <Button
                  variant="outline-success"
                  className="w-100"
                  onClick={() => handleShare('whatsapp')}
                  disabled={selectedItems.length === 0}
                >
                  <FaWhatsapp className="me-2" /> WhatsApp
                </Button>
              </Col>
              <Col xs={6} md={3} className="mb-2">
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => handleShare('email')}
                  disabled={selectedItems.length === 0}
                >
                  <FaEnvelope className="me-2" /> Email
                </Button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SharePurchase;
