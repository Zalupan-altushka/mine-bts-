import React from 'react';
import SeedPlant from './SeedPlant.gif'; 

function Plant() {

  return(
    <div>
      <img src={SeedPlant} alt="Star" style={{ width: '80px', height: '80px' }}/>
    </div>
  );
}

export default Plant;