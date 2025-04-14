import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends() {
  const handleInviteClick = () => {
    const message = "Привет! Я хочу пригласить тебя в наш проект. Вот ссылка: https://t.me/mine_bts_bot/zZ22";
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent("https://t.me/mine_bts_bot/zZ22")}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <section className='bodyfriendspage'>
      <div className='margin-div-fr'></div>
      <TotalFR />
      <Bonus />
      <Reward />
      <section className='Container-button'>
        <button className='get-reward-button'>Claim Reward</button>
        <button className='Invite-button' onClick={handleInviteClick}>Let's Invite Friends</button>
      </section>
      <Menu />
    </section>
  );
}

export default Friends;