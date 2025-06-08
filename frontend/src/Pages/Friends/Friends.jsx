import React, { useEffect, useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
  const [totalFriends, setTotalFriends] = useState(0);
  const [totalReward, setTotalReward] = useState(0);

  useEffect(() => {
    // Отправка запроса к Netlify Function для обработки пользователя
    fetch('https://ah-user.netlify.app/.netlify/functions/userHandler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.total_friends !== undefined) {
          setTotalFriends(data.total_friends);
          localStorage.setItem('total_friends', data.total_friends);
        }
        if (data.total_reward !== undefined) {
          setTotalReward(data.total_reward);
          localStorage.setItem('total_reward', data.total_reward);
        }
      })
      .catch(error => console.error('Error handling user:', error));

    // Обновление состояния из локального хранилища
    const friends = localStorage.getItem('total_friends');
    const reward = localStorage.getItem('total_reward');

    if (friends) {
      setTotalFriends(parseInt(friends, 10));
    }

    if (reward) {
      setTotalReward(parseFloat(reward));
    }
  }, [userData]);

  const handleInviteClick = () => {
    const userId = userData?.telegram_user_id;
    if (!userId) {
      console.warn("User ID not found, cannot generate invite link.");
      return;
    }

    const message = "Join me in 'Mine BTS!' and let's mine new gold! Use my invite link to join🎉";
    const inviteLink = `https://t.me/mine_bts_bot/zZ22?ref=${userId}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleClaimReward = () => {
    // Логика для получения награды
    alert(`You have claimed your reward of ${totalReward.toFixed(3)} BTS!`);
    // Обнуляем награду после получения
    setTotalReward(0);
    localStorage.setItem('total_reward', 0);
  };

  return (
    <section className='bodyfriendspage'>
      <div className='margin-div-fr'></div>
      <TotalFR totalFriends={totalFriends} />
      <Bonus />
      <Reward totalReward={totalReward} />
      <section className='Container-button'>
        <button className='get-reward-button' onClick={handleClaimReward}>Claim Reward</button>
        <button className='Invite-button' onClick={handleInviteClick}>Invite Friends</button>
      </section>
      <Menu />
    </section>
  );
}

export default Friends;