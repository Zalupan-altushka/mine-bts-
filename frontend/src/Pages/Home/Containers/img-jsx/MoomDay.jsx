import React from 'react';
import moonDay from './moonDay.gif';
import './CSS-resize/GIF-img-home.css';  

function MoomDay() {

  return(
    <div>
      <img src={moonDay} alt="Star" className='mini-image' />
    </div>
  );
}

export default MoomDay;