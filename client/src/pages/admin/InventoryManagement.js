import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaBoxOpen, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import LowStockAlert from '../../components/admin/LowStockAlert';

const InventoryManagement = () => {
  const { userInfo } = useContext(AuthContext);
  const [loading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!userInfo || userInfo.role !== 'admin') {
      setError('You do not have permission to view this page');
    }
  }, [userInfo]);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Inventory Management</h1>
          <p className="text-muted">Monitor and manage your product inventory</p>
        </Col>
        <Col xs="auto">
          <Link to="/admin/productlist">
            <Button variant="outline-secondary" className="d-flex align-items-center">
              <FaArrowLeft className="me-2" /> Back to Products
            </Button>
          </Link>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Row>
            <Col xs={12}>
              <LowStockAlert />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Inventory Overview</h5>
                </Card.Header>
                <Card.Body>
                  <p>
                    This dashboard helps you manage your inventory efficiently. You can:
                  </p>
                  <ul>
                    <li>Monitor low stock and out-of-stock products</li>
                    <li>Set custom threshold levels for each product</li>
                    <li>Send email notifications to admin users</li>
                    <li>Track inventory changes over time</li>
                  </ul>
                  <p>
                    Use the "Notify Admins" button to send an email alert to all administrators
                    about current inventory status.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Inventory Tips</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <FaExclamationTriangle className="text-warning" size={24} />
                    </div>
                    <div>
                      <h6>Set Appropriate Thresholds</h6>
                      <p className="text-muted mb-0">
                        Set different thresholds for different products based on their sales velocity.
                        Fast-moving products should have higher thresholds.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <FaBoxOpen className="text-primary" size={24} />
                    </div>
                    <div>
                      <h6>Regular Inventory Audits</h6>
                      <p className="text-muted mb-0">
                        Conduct regular physical inventory counts to ensure your system data
                        matches actual stock levels.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <FaExclamationTriangle className="text-danger" size={24} />
                    </div>
                    <div>
                      <h6>Prioritize Restocking</h6>
                      <p className="text-muted mb-0">
                        Focus on restocking popular items that are running low to avoid
                        lost sales opportunities.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default InventoryManagement;
