import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaStar, FaEdit, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderReviewButton = ({ product, userToken, orderId }) => {
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkReviewStatus = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        };

        // Get all reviews for this product
        const { data } = await axios.get(`/api/reviews/product/${product._id}`, config);
        
        // Check if user has already reviewed this product
        const userReviews = data.filter(review => review.user === userToken.userId);
        setHasReviewed(userReviews.length > 0);
        setLoading(false);
      } catch (err) {
        console.error('Error checking review status:', err);
        setLoading(false);
      }
    };

    if (product && product._id && userToken) {
      checkReviewStatus();
    }
  }, [product, userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !comment.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitLoading(true);
      setError('');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      };

      await axios.post(
        '/api/reviews',
        {
          productId: product._id,
          rating,
          title,
          comment,
        },
        config
      );

      setSubmitLoading(false);
      setShowModal(false);
      setHasReviewed(true);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Something went wrong. Please try again.'
      );
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Button size="sm" variant="outline-secondary" disabled>Loading...</Button>;
  }

  if (hasReviewed) {
    return (
      <Button size="sm" variant="success" disabled className="d-flex align-items-center">
        <FaCheck className="me-1" /> Reviewed
      </Button>
    );
  }

  return (
    <>
      <div className="d-flex">
        <Button 
          size="sm" 
          variant="outline-primary" 
          className="me-1 d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <FaStar className="me-1" /> Review
        </Button>
        <Link 
          to={`/product/${product._id}`} 
          className="btn btn-sm btn-outline-secondary d-flex align-items-center"
        >
          <FaEdit className="me-1" /> View
        </Link>
      </div>

      {/* Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Review {product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col xs={12} className="text-center mb-3">
                <div className="star-rating">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index}>
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
                          size={30}
                          style={{ cursor: 'pointer', margin: '0 5px' }}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                        />
                      </label>
                    );
                  })}
                </div>
                <div className="text-muted mt-1">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </div>
              </Col>
            </Row>

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

            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your experience with this product"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </Form.Group>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderReviewButton;
