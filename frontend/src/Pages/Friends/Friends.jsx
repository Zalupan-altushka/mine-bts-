import React from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';

const REFERRAL_FUNCTION_URL = 'https://ah-user.netlify.app/.netlify/functions/referall'; // Убедитесь, что URL правильный

function Friends({ userData }) {
    const handleInviteClick = () => {
        const inviteLink = userData?.invite_link;
        if (!inviteLink) {
            console.warn("Invite link not found, cannot generate invite link.");
            return;
        }

        const message = "Join me in 'Mine BTS!' and let's mine new gold! Use my invite link to join🎉";
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
    };

    const handleReferral = async (referralCode) => {
        const userId = userData?.telegram_user_id;
        if (!userId || !referralCode) {
            console.warn("User ID or referral code not found, cannot process referral.");
            return;
        }

        try {
            const response = await fetch(REFERRAL_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, referralCode }),
            });

            const data = await response.json();
            if (data.isValid) {
                console.log("Referral processed successfully:", data.message);
            } else {
                console.error("Error processing referral:", data.error);
            }
        } catch (error) {
            console.error("Error sending referral request:", error);
        }
    };

    // Пример использования handleReferral при загрузке компонента
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');
        if (referralCode) {
            handleReferral(referralCode);
        }
    }, [userData]);

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