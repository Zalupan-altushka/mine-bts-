import React from 'react';
import './Loader.css'; // Импортируем стили для анимации

const Loader = ({ success }) => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <div className="text-container">
        <p className="welcome-text">Welcome!</p>
        {success ? (
          <p className="status-text-good">Success!</p>
        ) : (
          <p className="status-text">Checking authorization...</p>
        )}
      </div>
    </div>
  );
};

export default Loader;