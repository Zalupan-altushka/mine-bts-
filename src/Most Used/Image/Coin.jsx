import React from 'react';
import currency from '../../Most Used/Image/currency.png'; 

function Coin() {

  return(
    <div>
      <img src={currency} alt="Star" style={{ width: '30px', height: '30px' }}/>
    </div>
  );
}

export default Coin;