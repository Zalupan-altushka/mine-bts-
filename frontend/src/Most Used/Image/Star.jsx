import React from 'react';
import star from '../../Most Used/Image/star.gif'; 

function Star() {

  return(
    <div>
      <img src={star} alt="Star" style={{ width: '40px', height: '40px' }}/>
    </div>
  );
}

export default Star;