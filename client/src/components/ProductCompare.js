import React, { useState, useContext } from 'react';
import { Modal, Button, Table, Image, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaTrash, FaCheck, FaTimes, FaShoppingCart, FaPlus } from 'react-icons/fa';
import './ProductCompare.css';
import { CompareContext } from '../context/CompareContext';

const ProductCompare = () => {
  const [show, setShow] = useState(false);
  const { compareList, loading, error, removeFromCompare, clearCompareList } = useContext(CompareContext);

  // Handle modal open/close
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Get all unique features from products for comparison
  const getFeatures = () => {
    const features = new Set();

    compareList.forEach(product => {
      if (product.features && Array.isArray(product.features)) {
        product.features.forEach(feature => features.add(feature.name));
      }
    });

    return Array.from(features);
  };

  // Check if a product has a specific feature
  const hasFeature = (product, featureName) => {
    if (!product.features || !Array.isArray(product.features)) {
      return false;
    }

    return product.features.some(feature => feature.name === featureName);
  };

  return (
    <>
      <button
        className={`compare-button ${compareList.length > 0 ? 'compare-button-active' : ''}`}
        onClick={handleShow}
      >
        <FaExchangeAlt className="compare-button-icon" />
        <span>Compare</span>
        <span className="compare-button-badge">{compareList.length}</span>
      </button>

      <Modal show={show} onHide={handleClose} size="xl" className="compare-modal quick-view-modal">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <strong style={{ color: '#FF6B00', fontSize: '1.3rem' }}>Quick</strong>
            <span style={{ color: 'white', fontSize: '1.3rem' }}>Kart</span>
            <span className="ms-2">| Product Comparison</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : compareList.length === 0 ? (
            <div className="compare-empty-state">
              <div className="compare-empty-icon">
                <FaExchangeAlt size={50} />
              </div>
              <h4 className="compare-empty-title">Your compare list is empty</h4>
              <p className="compare-empty-text">
                Add products to compare by clicking the compare icon <FaExchangeAlt className="mx-1" /> on product cards.
              </p>
              <Link
                to="/"
                className="browse-products-btn btn-lg"
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                  window.location.href = '/';
                }}
              >
                <FaShoppingCart className="icon" /> Browse Products
              </Link>
            </div>
          ) : (
            <div className="comparison-table-wrapper">
              <Table responsive className="comparison-table">
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>Feature</th>
                    {compareList.map(product => (
                      <th key={product._id} style={{ width: `${80 / compareList.length}%` }}>
                        <div className="text-end mb-2">
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => removeFromCompare(product._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Product Image */}
                  <tr className="bg-light">
                    <td><strong>Product</strong></td>
                    {compareList.map(product => (
                      <td key={product._id} className="text-center">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fluid
                          style={{ maxHeight: '120px', objectFit: 'contain' }}
                          className="my-2"
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Product Name */}
                  <tr>
                    <td><strong>Name</strong></td>
                    {compareList.map(product => (
                      <td key={product._id}>
                        <Link to={`/product/${product._id}`} className="fw-bold text-decoration-none">
                          {product.name}
                        </Link>
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr>
                    <td><strong>Price</strong></td>
                    {compareList.map(product => (
                      <td key={product._id} className="text-primary fw-bold">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td><strong>Category</strong></td>
                    {compareList.map(product => (
                      <td key={product._id}>
                        {product.category}
                      </td>
                    ))}
                  </tr>

                  {/* Stock */}
                  <tr>
                    <td><strong>Availability</strong></td>
                    {compareList.map(product => (
                      <td key={product._id}>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Out of Stock</Badge>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td><strong>Description</strong></td>
                    {compareList.map(product => (
                      <td key={product._id}>
                        <div style={{ maxHeight: '100px', overflow: 'auto' }}>
                          {product.description}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Features */}
                  {getFeatures().map(feature => (
                    <tr key={feature}>
                      <td><strong>{feature}</strong></td>
                      {compareList.map(product => (
                        <td key={product._id} className="text-center">
                          {hasFeature(product, feature) ? (
                            <FaCheck className="text-success" />
                          ) : (
                            <FaTimes className="text-danger" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Actions */}
                  <tr className="bg-light">
                    <td><strong>Actions</strong></td>
                    {compareList.map(product => (
                      <td key={product._id} className="text-center">
                        <div className="d-grid gap-2">
                          <Link
                            to={`/product/${product._id}`}
                            className="browse-products-btn btn-sm d-block mb-2"
                          >
                            <FaShoppingCart className="icon" /> View Product
                          </Link>
                          <Link
                            to={`/?category=${encodeURIComponent(product.category)}`}
                            className="similar-products-btn btn-sm d-block mb-2"
                            onClick={(e) => {
                              e.preventDefault();
                              handleClose();
                              window.location.href = `/?category=${encodeURIComponent(product.category)}`;
                            }}
                          >
                            <FaExchangeAlt className="icon" /> Similar Products
                          </Link>
                        </div>
                      </td>
                    ))}
                    {compareList.length < 4 && (
                      <td className="text-center">
                        <Link
                          to="/"
                          className="browse-products-btn btn-sm d-block mb-2"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClose();
                            window.location.href = '/';
                          }}
                          style={{ background: 'linear-gradient(to right, #28a745, #20c997)' }}
                        >
                          <FaPlus className="icon" /> Add More
                        </Link>
                      </td>
                    )}
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="me-2">
            Close
          </Button>
          {compareList.length > 0 && (
            <Button variant="danger" onClick={clearCompareList}>
              Clear All
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Export the component
export default ProductCompare;
