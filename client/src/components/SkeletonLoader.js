import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const SkeletonProduct = () => {
  return (
    <Card className="product-card">
      <div className="skeleton skeleton-image"></div>
      <Card.Body>
        <div className="skeleton skeleton-text lg mb-2"></div>
        <div className="skeleton skeleton-text mb-2"></div>
        <div className="skeleton skeleton-text sm mb-3"></div>
        <div className="skeleton skeleton-text lg mb-3"></div>
        <div className="skeleton skeleton-button"></div>
      </Card.Body>
    </Card>
  );
};

const SkeletonLoader = ({ count = 8 }) => {
  return (
    <Row>
      {[...Array(count)].map((_, index) => (
        <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <SkeletonProduct />
        </Col>
      ))}
    </Row>
  );
};

export default SkeletonLoader;
