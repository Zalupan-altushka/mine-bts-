import './FriendsConnt.css'
import { Link } from 'react-router-dom';
import PlantFR from '../img-jsx/PlantFR';

function FriendsConnt(){
  
  return (
    <div className='friends-container'>
      <div className='left-section-gif'>
        <PlantFR />
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