import React from 'react';
import TonLogo from './TonLogo.png'; 
import './CSS-resize/GIF-img-br.css' 

function Tonlogo() {

  return(
    <div>
      <img src={TonLogo} alt="Star" className='all-image'/>
    </div>
  );
}

export default Tonlogo;