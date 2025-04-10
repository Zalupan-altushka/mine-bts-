import React from 'react';
import './ModalOne.css'

const ModalOne = ({ isVisible, onClose }) => {
  return (
    <>
      {isVisible && <div className="overlay" onClick={onClose}></div>}
      <div className={`modal ${isVisible ? 'visible' : ''}`}>
        <div className="modal-content">
          <span className='about-modal'>Unlimited storage</span>
          <button className="close-button1" onClick={onClose}>&times;</button>
          <div className='divider'></div>
          <span className='text-about-modal'>Basic storage accumulates up to 25 BTS</span>
          <div className="button-container">
            <button className='Modal-button'>12 hours for 0.1K</button>
            <button className='Modal-button'>24 hours for 0.3K</button>
            <button className='Modal-button'>1 month for 1K</button>
            <button className='Modal-button-other'>Forever for 2K</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalOne;