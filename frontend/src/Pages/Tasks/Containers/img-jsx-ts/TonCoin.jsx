import React from 'react';
import Ton_Logo from './Ton_Logo.png'; 

function TonCoin() {

  return(
    <div>
      <img src={Ton_Logo} alt="Star" style={{ width: '25px', height: '25px', marginTop: '7px', marginLeft: '10px' }}/>
    </div>
  );
}

export default TonCoin;