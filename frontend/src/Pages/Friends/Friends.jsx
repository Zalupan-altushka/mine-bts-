import React, { useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
    const AUTH_FUNCTION_URL = 'https://ah-user.netlify.app/.netlify/functions/auth'; // Убедитесь, что URL правильный
    const [log, setLog] = useState(''); // Состояние для хранения логов

    const handleInviteClick = () => {
        const inviteLink = userData?.invite_link;
        if (!inviteLink) {
            setLog("Invite link not found, cannot generate invite link.");
            console.warn("Invite link not found, cannot generate invite link.");
            return;
        }

        const message = "Join me in 'Mine BTS!' and let's mine new gold! Use my invite link to join🎉";
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');

        const referralCode = userData?.telegram_user_id;
        const initData = window.Telegram.WebApp.initData;

        const logMessage = `Sending referralCode: ${referralCode}\nSending initData: ${initData}`;
        setLog(logMessage); // Обновляем состояние с логом
        console.log("Friends.jsx: Sending referralCode:", referralCode);
        console.log("Friends.jsx: Sending initData:", initData);

        // Fetch call to update total_fr, include referralCode
        fetch(AUTH_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ referralCode: userData?.telegram_user_id, initData: window.Telegram.WebApp.initData }),
        })
            .then(response => {
                if (!response.ok) {
                    setLog(prevLog => prevLog + `\nError updating referral data: ${response.status}`);
                    console.error("Error updating referral data:", response.status);
                }
            })
            .catch(error => {
                setLog(prevLog => prevLog + `\nError during fetch: ${error}`);
                console.error("Error during fetch:", error);
            });
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
            {log && ( // Отображаем логи, если они есть
                <div className="friends-logs">
                    <pre>{log}</pre>
                </div>
            )}
            <Menu />
        </section>
    );
}

export default Friends;