import React from 'react';
import moon from './moon.gif';
import './CSS/GIF-home.css';  

function Moom() {

  return(
    <div>
      <img src={moon} alt="Star" className='mini-image' />
    </div>
  );
}

export default Moom;