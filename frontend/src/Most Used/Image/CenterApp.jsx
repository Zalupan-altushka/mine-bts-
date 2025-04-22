import React from 'react';
import Center from './Center.jpg'; 

function CenterApp() {

  return(
    <div>
      <img src={Center} alt="Star" style={{ width: '80px', height: '80px', borderRadius: '50px' }}/>
    </div>
  );
}

export default CenterApp;