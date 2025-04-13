import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends() {
  const handleInviteClick = () => {
    const message = "Join me in Mine BTS! and let's mine new gold! Use my invite link to join";
    const url = "https://t.me/MineBtsBot/btsapp"; // Replace with your link
    const telegramMessage = `${message} ${url}`;
    
    // Use tg://msg to send a message
    const telegramLink = `tg://msg?text=${encodeURIComponent(telegramMessage)}`;
    
    window.open(telegramLink, '_blank');
  };

  return (
    <section className='bodyfriendspage'>
      <div className='margin-div-fr'></div>
      <TotalFR />
      <Bonus />
      <Reward />
      <section className='Container-button'>
        <button className='get-reward-button'>Claim Reward</button>
        <button className='Invite-button' onClick={handleInviteClick}>Invite Friends</button>
      </section>
      <Menu />
    </section>
  );
}

export default Friends;