import React from 'react';
import GrHeart from './GrHeart.gif';
import './CSS-resize/GIF-img-home.css'

function GrHeartHome() {

  return(
    <div>
      <img src={GrHeart} alt="Star" className='mini-image'/>
    </div>
  );
}

export default GrHeartHome;