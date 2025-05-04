import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Card, Button, Modal, Badge } from 'react-bootstrap';
import { FaCamera, FaUpload, FaTrash, FaBox, FaReceipt, FaShoppingBag, FaQuestion } from 'react-icons/fa';
import axios from 'axios';
import Message from './Message';
import Loader from './Loader';
import './OrderImages.css';

const OrderImages = ({ orderId, userToken }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageType, setImageType] = useState('product');
  const [imageDescription, setImageDescription] = useState('');

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

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowModal(true);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setUploadLoading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('type', imageType);
      formData.append('description', imageDescription);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
      };

      const { data } = await axios.post(
        `/api/orders/${orderId}/images`,
        formData,
        config
      );

      // Add the new image to the images array
      setImages([...images, data]);
      setUploadLoading(false);
      setShowModal(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      setImageType('product');
      setImageDescription('');
    } catch (err) {
      setUploadError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setUploadLoading(false);
    }
  };

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

  return (
    <Card className="mt-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3>Order Images</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => document.getElementById('image-upload').click()}
        >
          <FaCamera className="me-2" /> Add Image
        </Button>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </Card.Header>
      <Card.Body>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : images.length === 0 ? (
          <Message variant="info">
            No images for this order. Add images to document your purchase or delivery.
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
                    onClick={() => {
                      setPreviewUrl(image.imageUrl);
                      setShowModal(true);
                    }}
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

        {uploadError && <Message variant="danger">{uploadError}</Message>}
      </Card.Body>

      {/* Image Preview Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="image-preview-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedImage ? 'Upload Image' : 'Image Preview'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Row className="g-0">
            <Col md={selectedImage ? 6 : 12}>
              <div className="image-preview-container p-3">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fluid
                  />
                )}
              </div>
              {!selectedImage && previewUrl && (
                <div className="p-3 bg-light">
                  <h5>Description</h5>
                  <p className="text-muted">
                    {images.find(img => img.imageUrl === previewUrl)?.description || 'No description provided'}
                  </p>
                  <h5>Type</h5>
                  <Badge
                    bg={
                      images.find(img => img.imageUrl === previewUrl)?.type === 'product' ? 'primary' :
                      images.find(img => img.imageUrl === previewUrl)?.type === 'delivery' ? 'success' :
                      images.find(img => img.imageUrl === previewUrl)?.type === 'receipt' ? 'info' : 'secondary'
                    }
                    className="p-2"
                  >
                    {images.find(img => img.imageUrl === previewUrl)?.type === 'product' && <FaShoppingBag className="me-1" />}
                    {images.find(img => img.imageUrl === previewUrl)?.type === 'delivery' && <FaBox className="me-1" />}
                    {images.find(img => img.imageUrl === previewUrl)?.type === 'receipt' && <FaReceipt className="me-1" />}
                    {images.find(img => img.imageUrl === previewUrl)?.type === 'other' && <FaQuestion className="me-1" />}
                    {(images.find(img => img.imageUrl === previewUrl)?.type || 'product').charAt(0).toUpperCase() +
                     (images.find(img => img.imageUrl === previewUrl)?.type || 'product').slice(1)}
                  </Badge>
                </div>
              )}
            </Col>
            {selectedImage && (
              <Col md={6}>
                <div className="mb-3">
                  <p><strong>Selected file:</strong> {selectedImage.name}</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="imageType" className="form-label">Image Type</label>
                  <select
                    id="imageType"
                    className="form-select"
                    value={imageType}
                    onChange={(e) => setImageType(e.target.value)}
                  >
                    <option value="product">Product</option>
                    <option value="delivery">Delivery/Packaging</option>
                    <option value="receipt">Receipt/Invoice</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="imageDescription" className="form-label">Description (optional)</label>
                  <textarea
                    id="imageDescription"
                    className="form-control"
                    rows="3"
                    placeholder="Add a brief description of this image..."
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                  ></textarea>
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          {selectedImage && (
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={uploadLoading}
            >
              {uploadLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="me-2" /> Upload
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default OrderImages;
