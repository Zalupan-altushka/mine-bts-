import React from 'react';
import CenterTGlogo from './CenterTGlogo.jpg'; 

function TGcenterLogo() {

  return(
    <div>
      <img src={CenterTGlogo} alt="Star" style={{ width: '25px', height: '25px', marginTop: '7px', borderRadius: '15px' }}/>
    </div>
  );
}

export default TGcenterLogo;