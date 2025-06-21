import './BosterContainer.css'
import { Link } from 'react-router-dom';
import ThunderBoost from '../img-jsx/ThunderBoost';

function BoosterContainer(){
  
  return (
    <div className='boost-container'>
      <div className='mid-left-section'>
        <span>Buy Booster to earn more BTS</span>
        <span>for passive mining</span>
        <Link to='/boost'>
          <button className='boost-go-button'>Let's go!</button>
        </Link>
      </div>
      <div className='right-section-gif'>
        <ThunderBoost />
      </div>
    </div>
  );
}

export default BoosterContainer;