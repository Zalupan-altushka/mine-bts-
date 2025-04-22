import React from 'react';
import Heart from './Heart.gif'; 

function GrHeart() {

  return(
    <div>
      <img src={Heart} alt="Star" style={{ width: '36px', height: '36px' }}/>
    </div>
  );
}

export default GrHeart;