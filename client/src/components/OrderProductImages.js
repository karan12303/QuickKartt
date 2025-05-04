import React, { useState } from 'react';
import { Image, Modal, Row, Col, Badge } from 'react-bootstrap';
import { FaBoxOpen } from 'react-icons/fa';
import './OrderImages.css';

const OrderProductImages = ({ orderItems }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!orderItems || orderItems.length === 0) {
    return null;
  }

  // Show up to 3 product images
  const visibleItems = orderItems.slice(0, 3);
  const remainingCount = orderItems.length - 3;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="product-thumbnails-container">
        <Row className="g-1">
          {visibleItems.map((item, index) => (
            <Col key={index} xs={4} className="thumbnail-col">
              <div 
                className="thumbnail-wrapper" 
                onClick={() => handleProductClick(item)}
                title={item.name}
              >
                <Image 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="thumbnail-image" 
                />
                {item.qty > 1 && (
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 end-0 m-1"
                    style={{ fontSize: '0.65rem' }}
                  >
                    x{item.qty}
                  </Badge>
                )}
              </div>
            </Col>
          ))}
          {remainingCount > 0 && (
            <Col xs={4} className="thumbnail-col">
              <div 
                className="thumbnail-wrapper more-images" 
                onClick={() => setShowModal(true)}
              >
                <div className="more-images-overlay">
                  <FaBoxOpen className="more-icon" />
                  <span>+{remainingCount}</span>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>

      {/* Product Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProduct ? selectedProduct.name : 'Order Products'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct ? (
            <Row>
              <Col md={6}>
                <Image 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name} 
                  fluid 
                  className="mb-3"
                />
              </Col>
              <Col md={6}>
                <h4>{selectedProduct.name}</h4>
                <p className="text-muted">Quantity: {selectedProduct.qty}</p>
                <p className="text-muted">Price: ₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                
                {selectedProduct.hasVariations && (
                  <div className="mt-3">
                    <h5>Specifications:</h5>
                    {selectedProduct.footwearSize && (
                      <div>
                        <p className="mb-1"><strong>UK Size:</strong> {selectedProduct.footwearSize.ukSize}</p>
                        <p className="mb-1"><strong>US Size:</strong> {selectedProduct.footwearSize.usSize}</p>
                      </div>
                    )}
                    {selectedProduct.smartphoneSpec && (
                      <div>
                        <p className="mb-1"><strong>Model:</strong> {selectedProduct.smartphoneSpec.model}</p>
                        <p className="mb-1"><strong>Storage:</strong> {selectedProduct.smartphoneSpec.storage}</p>
                        <p className="mb-1"><strong>RAM:</strong> {selectedProduct.smartphoneSpec.ram}</p>
                      </div>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          ) : (
            <Row className="g-3">
              {orderItems.map((item, index) => (
                <Col key={index} md={6} lg={4}>
                  <div 
                    className="product-card p-2 border rounded h-100" 
                    onClick={() => handleProductClick(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex">
                      <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="mb-1 small">Qty: {item.qty}</p>
                        <p className="mb-0 small">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderProductImages;
