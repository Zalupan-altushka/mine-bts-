import React, { useState, useEffect, useCallback } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
    const [reward, setReward] = useState(0); // Изначально 0
    const [showReward, setShowReward] = useState(false); // Add this line

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

    const handleClaimReward = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

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
                 setReward(0); // Reset reward after claiming
                 setShowReward(false);
                 window.location.reload();
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    const handleNewReferral = useCallback(() => {
        setReward(205.033);
        setShowReward(true);
    }, []);

    useEffect(() => {
        console.log("useEffect в Friends.jsx выполнен");
        const urlParams = new URLSearchParams(window.location.search);
        const initData = urlParams.get('initData');

        if (initData) {
            try {
                const parsedInitData = JSON.parse(decodeURIComponent(initData));
                console.log("Parsed telegramWebAppInitData:", parsedInitData);
                if (parsedInitData.success) {
                    handleNewReferral();
                     window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (error) {
                console.error('Error parsing telegramWebAppInitData:', error);
            }
        }
    }, [handleNewReferral]);

    return (
        <section className='bodyfriendspage'>
            <div className='margin-div-fr'></div>
            <TotalFR totalFriends={userData?.total_fr} />
            <Bonus />
            <Reward reward={showReward ? reward : 0} /> {/* Pass reward to the Reward component */}
            <section className='Container-button'>
                <button className='get-reward-button' onClick={handleClaimReward}>Claim Reward</button>
                <button className='Invite-button' onClick={handleInviteClick}>Invite Friends</button>
            </section>
            <Menu />
        </section>
    );
}

export default Friends;