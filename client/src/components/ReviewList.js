import React, { useState, useEffect, useContext } from 'react';
import { Card, Alert, Button, Row, Col, Form } from 'react-bootstrap';
import { FaStar, FaFilter, FaSort } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';

const ReviewList = ({ productId }) => {
  const { userInfo } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  const [sortOption, setSortOption] = useState('newest');
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/reviews/product/${productId}`);
      setReviews(data);

      // Check if user has already reviewed this product
      if (userInfo) {
        const userReview = data.find(
          (review) => review.user === userInfo._id
        );
        setHasReviewed(!!userReview);
      }

      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to load reviews'
      );
      setLoading(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
    setHasReviewed(true);
    setShowReviewForm(false);
  };

  const handleVote = (reviewId, helpfulVotes, unhelpfulVotes) => {
    setReviews(
      reviews.map((review) =>
        review._id === reviewId
          ? { ...review, helpfulVotes, unhelpfulVotes }
          : review
      )
    );
  };

  const handleDelete = (reviewId) => {
    setReviews(reviews.filter((review) => review._id !== reviewId));
    if (userInfo && reviews.find(r => r._id === reviewId && r.user === userInfo._id)) {
      setHasReviewed(false);
    }
  };

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  // Filter reviews by rating
  const filteredReviews = filterRating > 0
    ? reviews.filter((review) => review.rating === filterRating)
    : reviews;

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'most_helpful':
        return b.helpfulVotes - a.helpfulVotes;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Calculate rating statistics
  const ratingCounts = [0, 0, 0, 0, 0]; // 5 stars to 1 star
  reviews.forEach((review) => {
    ratingCounts[5 - review.rating]++;
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="reviews-section mt-4">
      <h3 className="mb-4">Customer Reviews</h3>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={4} className="text-center border-end">
                <h1 className="mb-0">{averageRating.toFixed(1)}</h1>
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < Math.round(averageRating) ? "#ffc107" : "#e4e5e9"}
                      size={20}
                      className="me-1"
                    />
                  ))}
                </div>
                <p className="text-muted mb-0">{reviews.length} reviews</p>
              </Col>

              <Col md={8}>
                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="d-flex align-items-center mb-2">
                      <div style={{ width: '60px' }}>
                        {star} {star === 1 ? 'star' : 'stars'}
                      </div>
                      <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{
                            width: `${reviews.length > 0 ? (ratingCounts[5 - star] / reviews.length) * 100 : 0}%`,
                          }}
                          aria-valuenow={reviews.length > 0 ? (ratingCounts[5 - star] / reviews.length) * 100 : 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <div style={{ width: '30px' }}>
                        {ratingCounts[5 - star]}
                      </div>
                      <Button
                        variant={filterRating === star ? "warning" : "outline-secondary"}
                        size="sm"
                        className="ms-2"
                        onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                      >
                        {filterRating === star ? 'Clear' : 'Filter'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Write Review Button */}
      {userInfo && !hasReviewed && (
        <div className="mb-4">
          <Button
            variant={showReviewForm ? "secondary" : "primary"}
            onClick={toggleReviewForm}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </Button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onReviewAdded={handleReviewAdded}
        />
      )}

      {/* Filter and Sort Options */}
      {reviews.length > 0 && (
        <Row className="mb-3 align-items-center">
          <Col xs={12} md={6} className="mb-2 mb-md-0">
            <div className="d-flex align-items-center">
              <FaFilter className="me-2" />
              <span className="me-2">Filter:</span>
              <Button
                variant={filterRating === 0 ? "primary" : "outline-secondary"}
                size="sm"
                className="me-1"
                onClick={() => setFilterRating(0)}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((star) => (
                <Button
                  key={star}
                  variant={filterRating === star ? "warning" : "outline-secondary"}
                  size="sm"
                  className="me-1"
                  onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                >
                  {star} ★
                </Button>
              ))}
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="d-flex align-items-center justify-content-md-end">
              <FaSort className="me-2" />
              <span className="me-2">Sort by:</span>
              <Form.Select
                size="sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="most_helpful">Most Helpful</option>
              </Form.Select>
            </div>
          </Col>
        </Row>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : sortedReviews.length === 0 ? (
        <Alert variant="info">
          {filterRating > 0
            ? `No ${filterRating}-star reviews yet.`
            : 'No reviews yet. Be the first to review this product!'}
        </Alert>
      ) : (
        <div className="reviews-list">
          {sortedReviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              onVote={handleVote}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
