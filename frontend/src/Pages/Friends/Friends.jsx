import React, { useEffect, useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

function Friends({ userData }) {
    const [totalFriends, setTotalFriends] = useState(userData?.total_fr || 0);
    const [isNewReferral, setIsNewReferral] = useState(false);

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

    useEffect(() => {
        // Fetch updated user data
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://ah-user.netlify.app/.netlify/functions/auth?userId=${userData.telegram_user_id}`);
                const data = await response.json();
                setTotalFriends(data.userData.total_fr);
                setIsNewReferral(data.isNewReferral);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userData]);

    return (
        <section className='bodyfriendspage'>
            <div className='margin-div-fr'></div>
            <TotalFR totalFriends={totalFriends} />
            <Bonus />
            <Reward isNewReferral={isNewReferral} />
            <section className='Container-button'>
                <button className='get-reward-button'>Claim Reward</button>
                <button className='Invite-button' onClick={handleInviteClick}>Invite Friends</button>
            </section>
            <Menu />
        </section>
    );
}

export default Friends;