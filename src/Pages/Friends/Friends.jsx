import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends() {
  const handleInviteClick = () => {
    const message = "Join me in Mine BTS! and let's mine new gold! Use my invite link to join🎉";
    const url = "https://mine-bts.netlify.app"; // Замените на вашу ссылку
    const telegramLink = `https://telegram.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
    
    window.open(telegramLink, '_blank');
  };

  return (
    <section className='bodyfriendspage'>
      <TotalFR />
      <Bonus />
      <Reward />
      <section className='Container-button'>
        <button className='Invite-button' onClick={handleInviteClick}>Invite Friends</button>
      </section>
      <Menu />
    </section>
  );
}

export default Friends;
