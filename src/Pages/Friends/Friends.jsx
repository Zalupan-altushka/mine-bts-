import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends() {
 
  return (
    <section className='bodyfriendspage'>
      <div className='margin-div-fr'></div>
      <TotalFR />
      <Bonus />
      <Reward />
      <section className='Container-button'>
        <button className='get-reward-button'>Claim Reward</button>
        <button className='Invite-button'>Invite Friends</button>
      </section>
      <Menu />
    </section>
  );
}

export default Friends;