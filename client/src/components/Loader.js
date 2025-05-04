import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="text-center">
      <Spinner
        animation="border"
        role="status"
        style={{
          width: '100px',
          height: '100px',
          margin: 'auto',
          display: 'block',
          color: '#ff5722'
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3 text-muted">Loading QuickKart...</p>
    </div>
  );
};

export default Loader;
