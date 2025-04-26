import React from 'react';
import './Loader.css';

const Loader = ({ message, showSuccess }) => {
  return (
    <div className="loader">
      <div className="message-box">
        {message}
        {showSuccess && <div className="success-text">успешно!</div>}
      </div>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;