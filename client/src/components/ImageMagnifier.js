import React, { useState, useRef } from 'react';
import { Image } from 'react-bootstrap';
import { motion } from 'framer-motion';

const ImageMagnifier = ({
  src,
  alt,
  width = '100%',
  height = '400px',
  magnifierHeight = 150,
  magnifierWidth = 150,
  zoomLevel = 2.5
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    // Get image size only when needed
    const { width, height } = imgRef.current.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    // Calculate cursor position on the image
    const { left, top } = imgRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    setXY([x, y]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleTouchStart = (e) => {
    // Get image size
    const { width, height } = imgRef.current.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
    
    // Calculate touch position
    const touch = e.touches[0];
    const { left, top } = imgRef.current.getBoundingClientRect();
    const x = touch.pageX - left - window.scrollX;
    const y = touch.pageY - top - window.scrollY;
    setXY([x, y]);
  };

  const handleTouchMove = (e) => {
    // Prevent scrolling when zooming
    e.preventDefault();
    
    // Calculate touch position
    const touch = e.touches[0];
    const { left, top } = imgRef.current.getBoundingClientRect();
    const x = touch.pageX - left - window.scrollX;
    const y = touch.pageY - top - window.scrollY;
    setXY([x, y]);
  };

  const handleTouchEnd = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      className="image-magnifier-container position-relative"
      style={{
        width,
        height,
        overflow: 'hidden'
      }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="image-wrapper"
      >
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fluid
          className="rounded-lg shadow-sm"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            cursor: 'zoom-in'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </motion.div>

      {showMagnifier && (
        <div
          className="magnifier-glass"
          style={{
            position: 'absolute',
            // Position the magnifier
            left: `${x - magnifierWidth / 2}px`,
            top: `${y - magnifierHeight / 2}px`,
            width: `${magnifierWidth}px`,
            height: `${magnifierHeight}px`,
            opacity: 1,
            border: '2px solid #fff',
            borderRadius: '50%',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPosition: `${-x * zoomLevel + magnifierWidth / 2}px ${
              -y * zoomLevel + magnifierHeight / 2
            }px`,
            pointerEvents: 'none',
            zIndex: 9,
            boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
