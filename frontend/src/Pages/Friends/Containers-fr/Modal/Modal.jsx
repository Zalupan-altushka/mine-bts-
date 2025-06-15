import React from 'react';
import './Modal.css'; // Создайте файл Modal.css для стилей

function Modal({ children, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <span className="modal-title">About the Referral Program</span>
        </div>
        <div className="modal-divider"></div>
        {children}
        <div className='block-text-m'>
          <span>You get a reward only if the user who</span>
          <span className='second-span-bonus-m'>followed your link is new</span>
        </div>
        <div className='block-text-m'>
          <span>Your friends join $BTS</span>
          <span className='second-span-bonus-m'>And thay start mining </span>
        </div>
        <div className='block-text-m'>
          <span>Learn & Earn Together!</span>
          <span className='second-span-bonus-m'>Get points to refferals</span>
        </div>
      </div>
    </div>
  );
}

export default Modal;