import React, { useState, useEffect } from 'react';
import './Loader.css'; // Импортируем стили для анимации

const Loader = ({ success }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true); // Показываем "Success!"
      const timer = setTimeout(() => {
        setShowSuccess(false); // Скрываем "Success!" через 2 секунды
      }, 2000);

      return () => clearTimeout(timer); // Очищаем таймер при размонтировании компонента
    }
  }, [success]);

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