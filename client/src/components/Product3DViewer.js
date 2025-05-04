import React from 'react';
import { motion } from 'framer-motion';

// Simplified 3D Viewer component that doesn't rely on Three.js
const Product3DViewer = ({
  productImage,
  height = '400px',
  backgroundColor = '#f8f9fa'
}) => {
  return (
    <div style={{ height, width: '100%', backgroundColor, position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
      {/* Fallback to a 3D-like rotating image display */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: '1000px'
        }}
      >
        <motion.div
          animate={{
            rotateY: [0, 10, 0, -10, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{
            width: '80%',
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformStyle: 'preserve-3d'
          }}
        >
          <img
            src={productImage || '/images/product-placeholder.svg'}
            alt="Product 3D View"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          />
        </motion.div>
      </motion.div>

      {/* Decorative elements to create 3D-like effect */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '0',
        width: '100%',
        textAlign: 'center',
        color: '#3a86ff',
        fontFamily: 'var(--font-display)',
        fontSize: '14px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Interactive 3D View
      </div>

      {/* Decorative grid lines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(58, 134, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(58, 134, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        pointerEvents: 'none'
      }} />

      {/* Decorative circles */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(58, 134, 255, 0.1)',
          pointerEvents: 'none'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'rgba(255, 0, 110, 0.1)',
          pointerEvents: 'none'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </div>
  );
};

export default Product3DViewer;
