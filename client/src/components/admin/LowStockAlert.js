import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Button, Alert, Form, Modal } from 'react-bootstrap';
import { FaBell, FaExclamationTriangle, FaEnvelope, FaPlus, FaBoxOpen } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../Loader';

const LowStockAlert = () => {
  const { userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [threshold, setThreshold] = useState(10);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newThreshold, setNewThreshold] = useState(10);
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [restocking, setRestocking] = useState(false);

  useEffect(() => {
    fetchLowStockProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Add limit=1000 to ensure all products are returned
      const { data } = await axios.get(
        `/api/inventory-notifications/low-stock?threshold=${threshold}&limit=1000`,
        config
      );

      setLowStockProducts(data.lowStockProducts);
      setOutOfStockProducts(data.outOfStockProducts);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch low stock products'
      );
      setLoading(false);
    }
  };

  const handleNotifyAdmins = async () => {
    try {
      setNotifying(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/inventory-notifications/notify-admins',
        { threshold },
        config
      );

      setSuccess(data.message);
      setShowNotifyModal(false);
      setNotifying(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to send notifications'
      );
      setNotifying(false);
    }
  };

  const openThresholdModal = (product) => {
    setSelectedProduct(product);
    setNewThreshold(product.lowStockThreshold || 10);
    setShowThresholdModal(true);
  };

  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setRestockQuantity(1);
    setShowRestockModal(true);
  };

  const handleRestockProduct = async () => {
    try {
      setRestocking(true);
      setError('');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/inventory-notifications/${selectedProduct._id}/restock`,
        { quantity: restockQuantity },
        config
      );

      // Update product in state
      const updatedLowStockProducts = lowStockProducts.map(product =>
        product._id === selectedProduct._id
          ? { ...product, countInStock: product.countInStock + parseInt(restockQuantity) }
          : product
      ).filter(product => product.countInStock <= product.lowStockThreshold);

      const updatedOutOfStockProducts = outOfStockProducts.map(product =>
        product._id === selectedProduct._id
          ? { ...product, countInStock: product.countInStock + parseInt(restockQuantity) }
          : product
      ).filter(product => product.countInStock === 0);

      // If the product was out of stock but now has stock, move it to low stock if applicable
      if (selectedProduct.countInStock === 0 && parseInt(restockQuantity) > 0) {
        const updatedProduct = {
          ...selectedProduct,
          countInStock: parseInt(restockQuantity)
        };

        // If the updated stock is still below threshold, add to low stock products
        if (updatedProduct.countInStock <= (updatedProduct.lowStockThreshold || 10)) {
          updatedLowStockProducts.push(updatedProduct);
        }
      }

      setLowStockProducts(updatedLowStockProducts);
      setOutOfStockProducts(updatedOutOfStockProducts);

      setSuccess(data.message);
      setShowRestockModal(false);
      setRestocking(false);

      // Refresh the data to ensure everything is up to date
      fetchLowStockProducts();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to restock product'
      );
      setRestocking(false);
    }
  };

  const handleUpdateThreshold = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/inventory-notifications/${selectedProduct._id}/threshold`,
        { threshold: newThreshold },
        config
      );

      // Update product in state
      const updatedLowStockProducts = lowStockProducts.map(product =>
        product._id === selectedProduct._id
          ? { ...product, lowStockThreshold: newThreshold }
          : product
      );

      const updatedOutOfStockProducts = outOfStockProducts.map(product =>
        product._id === selectedProduct._id
          ? { ...product, lowStockThreshold: newThreshold }
          : product
      );

      setLowStockProducts(updatedLowStockProducts);
      setOutOfStockProducts(updatedOutOfStockProducts);

      setSuccess(`Threshold updated for ${selectedProduct.name}`);
      setShowThresholdModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update threshold'
      );
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0 d-flex align-items-center">
          <FaBell className="me-2 text-warning" /> Inventory Alerts
        </h5>
        <div className="d-flex align-items-center">
          <Form.Group className="mb-0 me-3 d-flex align-items-center">
            <Form.Label className="me-2 mb-0">Threshold:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              style={{ width: '70px' }}
            />
          </Form.Group>
          <Button
            variant="warning"
            size="sm"
            onClick={() => setShowNotifyModal(true)}
            disabled={lowStockProducts.length === 0 && outOfStockProducts.length === 0}
          >
            <FaEnvelope className="me-1" /> Notify Admins
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {loading ? (
          <Loader />
        ) : (
          <>
            {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
              <Alert variant="success">
                All products are above the threshold. Inventory levels are healthy.
              </Alert>
            ) : (
              <>
                {outOfStockProducts.length > 0 && (
                  <div className="mb-4">
                    <h5 className="d-flex align-items-center text-danger mb-3">
                      <FaExclamationTriangle className="me-2" /> Out of Stock Products ({outOfStockProducts.length})
                    </h5>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Threshold</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outOfStockProducts.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>₹{product.price.toLocaleString('en-IN')}</td>
                            <td>{product.lowStockThreshold || 10}</td>
                            <td>
                              <div className="d-flex">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => openThresholdModal(product)}
                                >
                                  Set Threshold
                                </Button>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => openRestockModal(product)}
                                >
                                  <FaPlus className="me-1" /> Restock
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                {lowStockProducts.length > 0 && (
                  <div>
                    <h5 className="d-flex align-items-center text-warning mb-3">
                      <FaBell className="me-2" /> Low Stock Products ({lowStockProducts.length})
                    </h5>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Current Stock</th>
                          <th>Threshold</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.map((product) => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.countInStock}</td>
                            <td>{product.lowStockThreshold || 10}</td>
                            <td>₹{product.price.toLocaleString('en-IN')}</td>
                            <td>
                              <Badge bg="warning">Low Stock</Badge>
                            </td>
                            <td>
                              <div className="d-flex">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => openThresholdModal(product)}
                                >
                                  Set Threshold
                                </Button>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => openRestockModal(product)}
                                >
                                  <FaPlus className="me-1" /> Restock
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card.Body>

      {/* Notify Admins Modal */}
      <Modal show={showNotifyModal} onHide={() => setShowNotifyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notify Admins</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This will send an email notification to all admin users about the current inventory status:
          </p>
          <ul>
            <li><strong>{outOfStockProducts.length}</strong> out of stock products</li>
            <li><strong>{lowStockProducts.length}</strong> low stock products (below threshold of {threshold})</li>
          </ul>
          <p>Are you sure you want to send this notification?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotifyModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleNotifyAdmins}
            disabled={notifying}
          >
            {notifying ? 'Sending...' : 'Send Notification'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Set Threshold Modal */}
      <Modal show={showThresholdModal} onHide={() => setShowThresholdModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Low Stock Threshold</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <p>
                Set the low stock threshold for <strong>{selectedProduct.name}</strong>.
                You will receive alerts when the stock falls below this number.
              </p>
              <Form.Group>
                <Form.Label>Threshold</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(parseInt(e.target.value))}
                />
                <Form.Text className="text-muted">
                  Current stock: {selectedProduct.countInStock}
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowThresholdModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateThreshold}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Restock Modal */}
      <Modal show={showRestockModal} onHide={() => setShowRestockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Restock Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="d-flex align-items-center mb-3">
                <FaBoxOpen className="text-success me-2" size={24} />
                <h5 className="mb-0">Restock {selectedProduct.name}</h5>
              </div>
              <p>
                Current stock: <strong>{selectedProduct.countInStock}</strong>
              </p>
              <Form.Group>
                <Form.Label>Add Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 1)}
                />
                <Form.Text className="text-muted">
                  New stock level will be: {selectedProduct.countInStock + (parseInt(restockQuantity) || 0)}
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRestockModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleRestockProduct}
            disabled={restocking || !restockQuantity || restockQuantity <= 0}
          >
            {restocking ? 'Processing...' : 'Confirm Restock'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default LowStockAlert;
