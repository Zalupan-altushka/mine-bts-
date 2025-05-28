import React from 'react';
import './Loader.css'; // Импортируем стили для анимации

const Loader = ({ success }) => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      {success ? (
        <p>Success!</p>
      ) : (
        <p>Welcome! Checking authorization...</p>
      )}
    </div>
  );
};

export default Loader;