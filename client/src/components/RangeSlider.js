import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const RangeSlider = ({ min, max, value, onChange, step = 1, formatLabel = val => val }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const rangeRef = useRef(null);
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Calculate percentage for styling
  const getPercent = (value) => {
    return Math.round(((value - min) / (max - min)) * 100);
  };
  
  // Handle slider change
  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    
    if (!isDragging) {
      onChange(newValue);
    }
  };
  
  // Handle mouse up to trigger onChange only once after dragging
  const handleMouseUp = () => {
    if (isDragging) {
      onChange(localValue);
      setIsDragging(false);
    }
  };
  
  // Handle mouse down to start dragging
  const handleMouseDown = () => {
    setIsDragging(true);
  };
  
  // Add event listeners for mouse up
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [localValue, isDragging]);
  
  // Calculate the left position for the thumb label
  const thumbLeftPosition = `calc(${getPercent(localValue)}% - 15px)`;
  
  return (
    <div className="range-slider-container mb-3">
      <div className="range-slider-labels d-flex justify-content-between mb-1">
        <small className="text-muted">{formatLabel(min)}</small>
        <small className="text-muted">{formatLabel(max)}</small>
      </div>
      
      <div className="range-slider-wrapper position-relative">
        <input
          ref={rangeRef}
          type="range"
          className="form-range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
        />
        
        <div 
          className="range-slider-progress" 
          style={{ 
            width: `${getPercent(localValue)}%`,
            backgroundColor: 'var(--primary)',
            height: '4px',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: 0,
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        />
        
        <div 
          className="range-slider-thumb-label" 
          style={{ 
            position: 'absolute',
            top: '-25px',
            left: thumbLeftPosition,
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }}
        >
          {formatLabel(localValue)}
        </div>
      </div>
      
      <Row className="mt-2">
        <Col>
          <Form.Control
            type="number"
            size="sm"
            value={localValue}
            onChange={(e) => {
              const newValue = Math.max(min, Math.min(max, Number(e.target.value)));
              setLocalValue(newValue);
              onChange(newValue);
            }}
            min={min}
            max={max}
            step={step}
          />
        </Col>
      </Row>
    </div>
  );
};

export default RangeSlider;
