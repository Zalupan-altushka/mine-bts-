import React from 'react';
import GrayWallet from './GrayWallet.svg'; 

function WalletIconOne() {

  return(
    <div>
      <img src={GrayWallet} alt="Star" style={{ width: '16px', height: '16px' }}/>
    </div>
  );
}

export default WalletIconOne;