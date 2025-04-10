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
        <span>and their referrals</span>
        <Link to='/friends'>
          <button className='invite-home-button'>Invite</button>
        </Link>
      </div>
    </div>
  );
}

export default FriendsConnt;