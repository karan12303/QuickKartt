import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Card, Button, Modal, Badge } from 'react-bootstrap';
import { FaTrash, FaBox, FaReceipt, FaShoppingBag, FaQuestion } from 'react-icons/fa';
import axios from 'axios';
import Message from './Message';
import Loader from './Loader';
import './OrderImages.css';

const OrderImagesView = ({ orderId, userToken }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch order images
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
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };

    if (orderId && userToken) {
      fetchOrderImages();
    }
  }, [orderId, userToken]);

  // Handle image deletion
  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      await axios.delete(`/api/orders/${orderId}/images/${imageId}`, config);

      // Remove the deleted image from the images array
      setImages(images.filter((img) => img._id !== imageId));
      setLoading(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  // Handle image click
  const handleImageClick = (image) => {
    setPreviewUrl(image.imageUrl);
    setSelectedImage(image);
    setShowModal(true);
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <h3>Order Images</h3>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : images.length === 0 ? (
          <Message variant="info">
            No images for this order. Images can be added from the Order History page.
          </Message>
        ) : (
          <Row>
            {images.map((image) => (
              <Col key={image._id} xs={6} md={4} lg={3} className="mb-3">
                <div className="order-image-container">
                  <Image
                    src={image.imageUrl}
                    alt={`Order ${orderId} image`}
                    className="order-image"
                    onClick={() => handleImageClick(image)}
                  />

                  {/* Image description overlay */}
                  {image.description && (
                    <div className="image-description-overlay">
                      {image.description}
                    </div>
                  )}

                  {/* Delete button */}
                  <Button
                    variant="danger"
                    size="sm"
                    className="delete-button"
                    onClick={() => handleDelete(image._id)}
                  >
                    <FaTrash />
                  </Button>

                  {/* Image type badge */}
                  <Badge
                    bg={
                      image.type === 'product' ? 'primary' :
                      image.type === 'delivery' ? 'success' :
                      image.type === 'receipt' ? 'info' : 'secondary'
                    }
                    className="image-type-badge"
                  >
                    {image.type === 'product' && <FaShoppingBag className="me-1" />}
                    {image.type === 'delivery' && <FaBox className="me-1" />}
                    {image.type === 'receipt' && <FaReceipt className="me-1" />}
                    {image.type === 'other' && <FaQuestion className="me-1" />}
                    {image.type.charAt(0).toUpperCase() + image.type.slice(1)}
                  </Badge>

                  {/* Date indicator */}
                  <div className="image-date">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>

      {/* Image Preview Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="image-preview-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            Image Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="image-preview-container p-3">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview"
                fluid
              />
            )}
          </div>
          {selectedImage && selectedImage.description && (
            <div className="p-3 bg-light">
              <h5>Description</h5>
              <p className="text-muted mb-0">
                {selectedImage.description}
              </p>
              <h5 className="mt-3">Type</h5>
              <Badge 
                bg={
                  selectedImage.type === 'product' ? 'primary' :
                  selectedImage.type === 'delivery' ? 'success' :
                  selectedImage.type === 'receipt' ? 'info' : 'secondary'
                }
                className="p-2"
              >
                {selectedImage.type === 'product' && <FaShoppingBag className="me-1" />}
                {selectedImage.type === 'delivery' && <FaBox className="me-1" />}
                {selectedImage.type === 'receipt' && <FaReceipt className="me-1" />}
                {selectedImage.type === 'other' && <FaQuestion className="me-1" />}
                {selectedImage.type.charAt(0).toUpperCase() + selectedImage.type.slice(1)}
              </Badge>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default OrderImagesView;
