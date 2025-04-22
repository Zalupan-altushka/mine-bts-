import './BosterContainer.css'
import Thunder from '../../../../Most Used/Image/Thunder';
import { Link } from 'react-router-dom';

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
        <Thunder />
      </div>
    </div>
  );
}

export default BoosterContainer;