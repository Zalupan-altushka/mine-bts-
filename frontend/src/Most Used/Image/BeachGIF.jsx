import React from 'react';
import beach from './beach.gif'; 

function BeachGIF() {

  return(
    <div>
      <img src={beach} alt="Star" style={{ width: '36px', height: '36px' }}/>
    </div>
  );
}

export default BeachGIF;