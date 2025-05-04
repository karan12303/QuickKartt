import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Image, Badge } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const SearchResults = ({ results, loading, onSelectResult }) => {
  if (loading) {
    return (
      <div className="search-results-dropdown">
        <ListGroup>
          <ListGroup.Item className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Searching...
          </ListGroup.Item>
        </ListGroup>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="search-results-dropdown">
        <ListGroup>
          <ListGroup.Item className="text-center py-3">
            <FaSearch className="me-2 text-muted" />
            No products found
          </ListGroup.Item>
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="search-results-dropdown">
      <ListGroup>
        {results.map((product) => (
          <ListGroup.Item
            key={product._id}
            action
            as={Link}
            to={`/product/${product._id ? product._id.toString() : ''}`}
            onClick={() => onSelectResult(product)}
            className="d-flex align-items-center py-2"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={40}
              height={40}
              className="me-3 object-fit-cover"
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <div className="product-name">{product.name}</div>
                <Badge bg="primary" className="ms-2">
                  ₹{product.price.toLocaleString('en-IN')}
                </Badge>
              </div>
              <div className="small text-muted">{product.category}</div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SearchResults;
