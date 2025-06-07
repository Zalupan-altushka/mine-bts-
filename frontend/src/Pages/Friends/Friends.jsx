import React, { useEffect, useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
  const [invitedFriends, setInvitedFriends] = useState(0);

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

  const handleClaimReward = () => {
    const newPoints = userData.points + 205.033;
    // Update points in database
    // Update points in local state
    // Update invitedFriends count
    const newInvitedFriends = invitedFriends + 1;
    setInvitedFriends(newInvitedFriends);
    localStorage.setItem('invitedFriends', newInvitedFriends);
  };

  return (
    <section className='bodyfriendspage'>
      <div className='margin-div-fr'></div>
      <TotalFR invitedFriends={invitedFriends} />
      <Bonus />
      <Reward invitedFriends={invitedFriends} />
      <section className='Container-button'>
        <button className='get-reward-button' onClick={handleClaimReward}>Claim Reward</button>
        <button className='Invite-button' onClick={handleInviteClick}>Invite Friends</button>
      </section>
      <Menu />
    </section>
  );
}

export default Friends;