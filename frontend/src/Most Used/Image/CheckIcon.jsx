import React from 'react';
import Check from './iconCheck.svg'; 

function CheckIcon() {

  return(
    <div>
      <img src={Check} alt="Star" style={{ width: '20px', height: '20px' }}/>
    </div>
  );
}

export default CheckIcon;