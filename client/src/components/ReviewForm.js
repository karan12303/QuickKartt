import React, { useState, useContext } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaStar, FaUpload, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { userInfo } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hover, setHover] = useState(0);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 photos
    if (photoFiles.length + files.length > 5) {
      setError('You can upload a maximum of 5 photos');
      return;
    }

    // Preview images
    const newPreviews = [...photoPreview];
    const newFiles = [...photoFiles];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setPhotoPreview([...newPreviews]);
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });

    setPhotoFiles(newFiles);
  };

  const removePhoto = (index) => {
    const newPreviews = [...photoPreview];
    const newFiles = [...photoFiles];

    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);

    setPhotoPreview(newPreviews);
    setPhotoFiles(newFiles);
  };

  const uploadPhotos = async () => {
    if (photoFiles.length === 0) return [];

    const formData = new FormData();
    photoFiles.forEach(file => {
      formData.append('photos', file);
    });

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/reviews/upload', formData, config);
      return data.photos;
    } catch (error) {
      throw new Error('Failed to upload photos');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a review title');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a review comment');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Upload photos if any
      let uploadedPhotos = [];
      if (photoFiles.length > 0) {
        uploadedPhotos = await uploadPhotos();
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/reviews',
        {
          productId,
          rating,
          title,
          comment,
          photos: uploadedPhotos,
        },
        config
      );

      setSuccess('Review submitted successfully!');
      setRating(0);
      setTitle('');
      setComment('');
      setPhotoFiles([]);
      setPhotoPreview([]);

      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded(data.review);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'An error occurred. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light">
        <h5 className="mb-0">Write a Review</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={submitHandler}>
          {/* Rating Stars */}
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <div className="star-rating">
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      style={{ display: 'none' }}
                    />
                    <FaStar
                      className="star"
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      size={24}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                      style={{ cursor: 'pointer', marginRight: '5px' }}
                    />
                  </label>
                );
              })}
              <span className="ms-2">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </Form.Group>

          {/* Review Title */}
          <Form.Group className="mb-3">
            <Form.Label>Review Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Summarize your experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          {/* Review Comment */}
          <Form.Group className="mb-3">
            <Form.Label>Your Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="What did you like or dislike about this product?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </Form.Group>

          {/* Photo Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Add Photos (Optional)</Form.Label>
            <div className="d-flex align-items-center mb-2">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                multiple
                className="d-none"
                id="review-photos"
              />
              <Button
                variant="outline-secondary"
                onClick={() => document.getElementById('review-photos').click()}
                className="d-flex align-items-center"
              >
                <FaUpload className="me-2" /> Upload Photos
              </Button>
              <small className="text-muted ms-3">
                Max 5 photos (JPG, PNG)
              </small>
            </div>

            {/* Photo Previews */}
            {photoPreview.length > 0 && (
              <Row className="mt-3">
                {photoPreview.map((preview, index) => (
                  <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                    <div className="position-relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="img-thumbnail"
                        style={{ height: '100px', objectFit: 'cover' }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0"
                        onClick={() => removePhoto(index)}
                        style={{ borderRadius: '50%', padding: '0.2rem 0.4rem' }}
                      >
                        <FaTimes size={12} />
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="mt-2"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ReviewForm;
