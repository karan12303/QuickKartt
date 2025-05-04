import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaImages } from 'react-icons/fa';
import Loader from './Loader';
import './OrderImages.css';

const OrderImageThumbnails = ({ orderId, userToken, maxImages = 3 }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    const fetchOrderImages = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        };

        const { data } = await axios.get(`/api/orders/${orderId}/images`, config);
        setImages(data);
        setTotalImages(data.length);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order images:', err);
        setLoading(false);
      }
    };

    if (orderId && userToken) {
      fetchOrderImages();
    }
  }, [orderId, userToken]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  if (loading) {
    return <Loader size="sm" />;
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="order-thumbnails-container">
        <Row className="g-1">
          {images.slice(0, maxImages).map((image) => (
            <Col key={image._id} xs={4} className="thumbnail-col">
              <div 
                className="thumbnail-wrapper" 
                onClick={() => handleImageClick(image)}
                title={image.description || `Order image`}
              >
                <Image 
                  src={image.imageUrl} 
                  alt={`Order image`} 
                  className="thumbnail-image" 
                />
              </div>
            </Col>
          ))}
          {totalImages > maxImages && (
            <Col xs={4} className="thumbnail-col">
              <div 
                className="thumbnail-wrapper more-images" 
                onClick={() => setShowModal(true)}
              >
                <div className="more-images-overlay">
                  <FaImages className="more-icon" />
                  <span>+{totalImages - maxImages}</span>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>

      {/* Image Preview Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="image-preview-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            Order Images
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedImage ? (
            <div className="image-preview-container p-3">
              <Image
                src={selectedImage.imageUrl}
                alt="Preview"
                fluid
              />
              {selectedImage.description && (
                <div className="p-3 bg-light">
                  <p className="text-muted mb-0">
                    {selectedImage.description}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3">
              <Row className="g-2">
                {images.map((image) => (
                  <Col key={image._id} xs={6} md={4} lg={3} className="mb-2">
                    <div className="order-image-container">
                      <Image
                        src={image.imageUrl}
                        alt={`Order image`}
                        className="order-image"
                        onClick={() => setSelectedImage(image)}
                      />
                      {image.description && (
                        <div className="image-description-overlay">
                          {image.description}
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderImageThumbnails;
