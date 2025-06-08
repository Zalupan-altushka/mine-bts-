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
    // Функция для обработки пользователя через Netlify Function
    const handleUser = async () => {
      if (!userData || !userData.telegram_user_id) {
        console.warn('User data is missing or invalid');
        return;
      }

      console.log('Sending request to userHandler with data:', userData);

      try {
        const response = await fetch('https://ah-user.netlify.app/.netlify/functions/userHandler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData: userData.initData }), // Убедитесь, что передаете initData
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Received response from userHandler:', data);

        if (data.userData) {
          setTotalFriends(data.userData.total_friends || 0);
          setTotalReward(data.userData.total_reward || 0);
          localStorage.setItem('total_friends', data.userData.total_friends || 0);
          localStorage.setItem('total_reward', data.userData.total_reward || 0);
        }
      } catch (error) {
        console.error('Error handling user:', error);
      }
    };

    // Проверка, пришел ли пользователь по реферальной ссылке
    const urlParams = new URLSearchParams(window.location.search);
    const referrerId = urlParams.get('ref');

    if (referrerId) {
      // Если пользователь пришел по реферальной ссылке, обновляем данные
      handleUser();
    } else {
      // Если пользователь не пришел по реферальной ссылке, загружаем данные из локального хранилища
      const friends = localStorage.getItem('total_friends');
      const reward = localStorage.getItem('total_reward');

      if (friends) {
        setTotalFriends(parseInt(friends, 10));
      }

      if (reward) {
        setTotalReward(parseFloat(reward));
      }
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