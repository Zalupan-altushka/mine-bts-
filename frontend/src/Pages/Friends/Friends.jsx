import React from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
    const handleInviteClick = () => {
        const telegramUserId = userData?.telegram_user_id;
        if (!telegramUserId) {
            console.warn("Telegram User ID not found.");
            return;
        }

        const message = "Join me in 'Mine BTS!' and let's mine new gold! Use my invite link to join🎉";
        const startAppValue = `ref_${telegramUserId}`; // Add a prefix to prevent collisions
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/mine_bts_bot?startapp=${startAppValue}`)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
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