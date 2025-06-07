import React, { useEffect, useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
  const [invitedFriends, setInvitedFriends] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    const storedInvitedFriends = localStorage.getItem('invitedFriends');
    if (storedInvitedFriends) {
      setInvitedFriends(parseInt(storedInvitedFriends, 10));
    }
  }, []);

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

  const handleClaimReward = async () => {
    const newPoints = userData.points + rewardPoints;
    // Update points in database
    await updatePointsInDatabase(newPoints);
    // Update points in local state
    setRewardPoints(0);
  };

  const updatePointsInDatabase = async (newPoints) => {
    const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';
    const userId = userData?.telegram_user_id;

    if (!userId) {
      console.warn("User ID not found, cannot update points.");
      return;
    }

    try {
      const response = await fetch(UPDATE_POINTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: userId,
          points: newPoints.toFixed(3),
        }),
      });

      if (!response.ok) {
        console.error("HTTP error при обновлении очков:", response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        console.error("Ошибка от Netlify Function:", data.error);
        throw new Error(`Failed to update points in database: ${data.error}`);
      }

      console.log("Очки успешно обновлены в базе данных!");
    } catch (error) {
      console.error("Ошибка при обновлении очков:", error);
    }
  };

  return (
    <section className='bodyfriendspage'>
      <div className='margin-div-fr'></div>
      <TotalFR invitedFriends={invitedFriends} />
      <Bonus />
      <Reward rewardPoints={rewardPoints} />
      <section className='Container-button'>
        <button className='get-reward-button' onClick={handleClaimReward}>Claim Reward</button>
        <button className='Invite-button' onClick={handleInviteClick}>Invite Friends</button>
      </section>
      <Menu />
    </section>
  );
}

export default Friends;