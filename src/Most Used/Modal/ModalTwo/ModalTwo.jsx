import React from 'react';
import './ModalTwo.css'

const ModalTwo = ({ isVisible, onClose }) => {
  return (
    <>
      {isVisible && <div className="overlay" onClick={onClose}></div>}
      <div className={`modal ${isVisible ? 'visible' : ''}`}>
        <div className="modal-content">
          <span className='about-modal'>Upgrade Time Waiting</span>
          <button className="close-button1" onClick={onClose}>&times;</button>
          <div className='divider'></div>
          <span className='text-about-modal'>Basic time between claims 12 hours</span>
          <div className="button-container">
            <button className='Modal-button'>12 hours for 0.5K</button>
            <button className='Modal-button'>24 hours for 1K</button>
            <button className='Modal-button'>1 month for 2K</button>
            <button className='Modal-button-other'>Forever for 3k</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalTwo;