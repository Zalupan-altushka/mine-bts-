import React from 'react';
import './Loader.css'; // Импортируем стили для анимации

const Loader = () => {
    return (
        <div className="loader">
            <div className="spinner"></div>
        </div>
    );
};

export default Loader;