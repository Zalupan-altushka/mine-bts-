import React from 'react';
import Heart from './Heart.gif';
import './CSS/GIF-home.css'

function GrHeart() {

  return(
    <div>
      <img src={Heart} alt="Star" className='mini-image'/>
    </div>
  );
}

export default GrHeart;