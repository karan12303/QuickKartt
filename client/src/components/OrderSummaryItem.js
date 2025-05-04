import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OrderSummaryItem = ({ item }) => {
  return (
    <motion.div 
      className="order-summary-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
    >
      <div className="order-summary-item-image">
        <img 
          src={item.imageUrl || '/images/product-placeholder.svg'} 
          alt={item.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/product-placeholder.svg";
          }}
        />
      </div>
      <div className="order-summary-item-details">
        <Link to={`/product/${item.product}`} className="text-decoration-none">
          <div className="order-summary-item-name">{item.name}</div>
        </Link>
        
        {/* Display variations if they exist */}
        {(item.size || item.color || item.model || item.storage || item.ram) && (
          <div className="order-summary-item-variant">
            {item.size && <span className="me-2">Size: {item.size}</span>}
            {item.color && <span className="me-2">Color: {item.color}</span>}
            {item.model && <span className="me-2">Model: {item.model}</span>}
            {item.storage && <span className="me-2">Storage: {item.storage}</span>}
            {item.ram && <span className="me-2">RAM: {item.ram}</span>}
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
          <div className="order-summary-item-price">
            ₹{item.price.toLocaleString('en-IN')}
          </div>
          <div className="order-summary-item-quantity">
            Qty: {item.qty}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummaryItem;
