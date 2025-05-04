import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaShippingFast, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const CheckoutProgress = ({ step }) => {
  // Define the steps in the checkout process
  const steps = [
    { id: 1, name: 'Sign In', icon: <FaUser /> },
    { id: 2, name: 'Shipping', icon: <FaShippingFast /> },
    { id: 3, name: 'Payment', icon: <FaCreditCard /> },
    { id: 4, name: 'Place Order', icon: <FaCheckCircle /> }
  ];

  // Calculate progress percentage for the progress bar
  const progressPercentage = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="checkout-progress mb-4">
      {/* Progress bar */}
      <motion.div 
        className="checkout-progress-bar"
        initial={{ width: '0%' }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* Steps */}
      {steps.map((s) => (
        <motion.div
          key={s.id}
          className={`checkout-step ${s.id === step ? 'active' : ''} ${s.id < step ? 'completed' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: s.id * 0.1 }}
        >
          <motion.div 
            className="checkout-step-circle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {s.id < step ? (
              <FaCheckCircle />
            ) : (
              s.icon
            )}
          </motion.div>
          <div className="checkout-step-label">{s.name}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default CheckoutProgress;
