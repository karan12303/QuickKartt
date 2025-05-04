import React, { useState, useContext } from 'react';
import { Card, Row, Col, Button, Badge, Modal, Image } from 'react-bootstrap';
import { FaStar, FaThumbsUp, FaThumbsDown, FaCheck, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ReviewItem.css';

const ReviewItem = ({ review, onVote, onDelete }) => {
  const { userInfo } = useContext(AuthContext);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user has voted on this review
  const userVote = userInfo && review.voters.find(
    voter => voter.user.toString() === userInfo._id
  );

  const handleVote = async (helpful) => {
    if (!userInfo) {
      // Redirect to login or show login prompt
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/reviews/${review._id}/vote`,
        { helpful },
        config
      );

      // Update review with new vote counts
      if (onVote) {
        onVote(review._id, data.helpfulVotes, data.unhelpfulVotes);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to record vote:', error);
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/api/reviews/${review._id}`, config);

      if (onDelete) {
        onDelete(review._id);
      }

      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Failed to delete review:', error);
      setLoading(false);
    }
  };

  const openPhotoModal = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoModal(true);
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Row>
          <Col md={9}>
            <div className="d-flex align-items-center mb-2">
              <div className="me-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                    size={16}
                    className="me-1"
                  />
                ))}
              </div>
              <h5 className="mb-0 ms-2">{review.title}</h5>
              {review.isVerifiedPurchase && (
                <Badge bg="success" className="ms-2">
                  <FaCheck className="me-1" /> Verified Purchase
                </Badge>
              )}
            </div>

            <p className="text-muted small mb-2">
              By {review.name} on {format(new Date(review.createdAt), 'MMMM d, yyyy')}
            </p>

            <p className="mb-3">{review.comment}</p>

            {/* Review Photos */}
            {review.photos && review.photos.length > 0 && (
              <div className="review-photos mb-3">
                <div className="d-flex flex-wrap">
                  {review.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="review-photo-thumbnail me-2 mb-2"
                      onClick={() => openPhotoModal(photo)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={photo}
                        alt={`Review ${index + 1}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Helpfulness Voting */}
            <div className="d-flex align-items-center mt-3">
              <span className="me-3">Was this review helpful?</span>
              <Button
                variant={userVote && userVote.helpful ? "primary" : "outline-primary"}
                size="sm"
                className="me-2 d-flex align-items-center"
                onClick={() => handleVote(true)}
                disabled={loading}
              >
                <FaThumbsUp className="me-1" />
                {review.helpfulVotes > 0 && review.helpfulVotes}
              </Button>
              <Button
                variant={userVote && !userVote.helpful ? "danger" : "outline-danger"}
                size="sm"
                className="d-flex align-items-center"
                onClick={() => handleVote(false)}
                disabled={loading}
              >
                <FaThumbsDown className="me-1" />
                {review.unhelpfulVotes > 0 && review.unhelpfulVotes}
              </Button>
            </div>
          </Col>

          {/* Admin or Owner Actions */}
          {userInfo && (userInfo.role === 'admin' || userInfo._id === review.user) && (
            <Col md={3} className="d-flex justify-content-end align-items-start">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteClick}
                disabled={loading}
                className="delete-review-btn"
                title="Delete this review"
              >
                <FaTrash className="me-1" />
                <span className="delete-text">Delete Review</span>
              </Button>
            </Col>
          )}
        </Row>
      </Card.Body>

      {/* Photo Modal */}
      <Modal
        show={showPhotoModal}
        onHide={() => setShowPhotoModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Review Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image
            src={selectedPhoto}
            alt="Review"
            fluid
            style={{ maxHeight: '70vh' }}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        size="sm"
        className="delete-confirmation-modal"
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title as="h5">
            <FaTrash className="me-2" /> Delete Review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Are you sure you want to delete this review? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              <>Delete</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ReviewItem;
