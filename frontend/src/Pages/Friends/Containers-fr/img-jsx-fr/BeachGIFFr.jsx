import React from 'react';
import BeachGif from './BeachGif.gif'; 
import './CSS-resize/GIF-img-fr.css'

function BeachGIFFr() {

  return(
    <div>
      <img src={BeachGif} alt="Star" className='mini-image'/>
    </div>
  );
}

export default BeachGIFFr;