import './FriendsConnt.css'
import Plant from '../../../../Most Used/Image/Plant';
import { Link } from 'react-router-dom';

function FriendsConnt(){
  
  return (
    <div className='friends-container'>
      <div className='left-section-gif'>
        <Plant />
      </div>
      <div className='mid-right-section'>
        <span>Get rewards for inviting friends</span>
        <span className='span-right-fr-conn'>and their referrals</span>
        <Link to='/friends'>
          <button className='invite-home-button'>Yes!</button>
        </Link>
      </div>
    </div>
  );
}

export default FriendsConnt;