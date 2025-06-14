import React, { useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
    const [reward, setReward] = useState(205.033); // Set the reward amount

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

    const handleClaimReward = async () => {
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points'; // Update the URL

        try {
            const response = await fetch(UPDATE_POINTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegramId: userData?.telegram_user_id, // Pass the user's Telegram ID
                    points: userData?.points + reward, // Calculate the new points
                }),
            });

            if (!response.ok) {
                console.error('Error claiming reward:', response.status);
            } else {
                // Update the local state with the new points
                const data = await response.json();
                console.log("Reward claimed successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    return (
        <section className='bodyfriendspage'>
            <div className='margin-div-fr'></div>
            <TotalFR totalFriends={userData?.total_fr} />
            <Bonus />
            <Reward reward={reward} /> {/* Pass reward to the Reward component */}
            <section className='Container-button'>
                <button className='get-reward-button' onClick={handleClaimReward}>Claim Reward</button>
                <button className='Invite-button' onClick={handleInviteClick}>Invite Friends</button>
            </section>
            <Menu />
        </section>
    );
}

export default Friends;