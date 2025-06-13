import React, { useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
    const [telegramUrl, setTelegramUrl] = useState(''); // Добавляем состояние для URL

    const handleInviteClick = () => {
        const inviteLink = userData?.invite_link;
        if (!inviteLink) {
            console.warn("Invite link not found, cannot generate invite link.");
            return;
        }

        const message = "Join me in 'Mine BTS!' and let's mine new gold! Use my invite link to join🎉";
        const url = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
        setTelegramUrl(url); // Обновляем состояние с URL
        console.log("Friends.jsx: telegramUrl:", url); // Все еще логируем в консоль для отладки
    };

    return (
        <section className='bodyfriendspage'>
            <div className='margin-div-fr'></div>
            <TotalFR totalFriends={userData?.total_fr} />
            <Bonus />
            {telegramUrl && ( // Условно отображаем URL, если он есть
                <div className="telegram-url">
                    <p>Generated Telegram URL:</p>
                    <a href={telegramUrl} target="_blank" rel="noopener noreferrer">{telegramUrl}</a>
                </div>
            )}
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