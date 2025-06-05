import React, { useEffect, useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (userData && userData.telegram_user_id) {
      const uniqueLink = `https://t.me/mine_bts_bot?start=${userData.telegram_user_id}`;
      setReferralLink(uniqueLink);
    }
  }, [userData]);

  const handleInviteClick = () => {
    const message = "Join me in 'Mine BTS!' and let's mine new gold! Use my invite link to join🎉";
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleReferral = async (referrerId, newUserId) => {
    const REFERRAL_URL = 'https://ah-user.netlify.app/.netlify/functions/handle-referral';

    try {
      const response = await fetch(REFERRAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referrerId,
          newUserId,
        }),
      });

      if (!response.ok) {
        console.error("HTTP error при обработке реферала:", response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        console.error("Ошибка от Netlify Function:", data.error);
        throw new Error(`Failed to handle referral: ${data.error}`);
      }

      console.log("Реферал успешно обработан!");
    } catch (error) {
      console.error("Ошибка при обработке реферала:", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerId = urlParams.get('start');

    if (referrerId && userData && userData.telegram_user_id) {
      handleReferral(referrerId, userData.telegram_user_id);
    }
  }, [userData]);

  return (
    <section className='bodyfriendspage'>
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