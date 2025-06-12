import React, { useEffect, useState } from 'react';
import './Friends.css';
import Menu from '../../Most Used/Menu/Menu';
import TotalFR from './Containers-fr/Total/TotalFR';
import Bonus from './Containers-fr/Bonuses/Bonus';
import Reward from './Containers-fr/Reward/Reward';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function Friends({ userData }) {
    const [inviteLink, setInviteLink] = useState('');

    useEffect(() => {
        const fetchInviteLink = async () => {
            if (userData?.telegram_user_id) {
                const { data, error } = await supabase
                    .from('users')
                    .select('invite_link')
                    .eq('telegram_user_id', userData.telegram_user_id)
                    .single();

                if (error) {
                    console.error("Error fetching invite link:", error);
                } else if (data) {
                    setInviteLink(data.invite_link);
                }
            }
        };

        fetchInviteLink();
    }, [userData]);

    const handleInviteClick = () => {
        const userId = userData?.telegram_user_id;
        if (!userId) {
            console.warn("User ID not found, cannot generate invite link.");
            return;
        }

        const finalInviteLink = inviteLink ;

        const message = "Join me in 'Mine BTS!' and let's mine new gold! Use my invite link to join🎉";
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(finalInviteLink)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
    };

    return (
        <section className='bodyfriendspage'>
            <div className='margin-div-fr'></div>
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