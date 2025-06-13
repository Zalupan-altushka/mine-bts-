import React from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
    const AUTH_FUNCTION_URL = 'https://authorezation.netlify.app/.netlify/functions/auth'; // Убедитесь, что URL правильный

    const handleInviteClick = () => {
        const inviteLink = userData?.invite_link;
        if (!inviteLink) {
            console.warn("Invite link not found, cannot generate invite link.");
            return;
        }

        const message = "Join me in 'Mine BTS!' and let's mine new gold! Use my invite link to join🎉";
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');

         fetch(AUTH_FUNCTION_URL , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ initData : window.Telegram.WebApp.initData , referralCode: userData?.telegram_user_id }),
                })
    };

    return (
        <section className='bodyfriendspage'>
            <div className='margin-div-fr'></div>
            <TotalFR totalFriends={userData?.total_fr} />
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