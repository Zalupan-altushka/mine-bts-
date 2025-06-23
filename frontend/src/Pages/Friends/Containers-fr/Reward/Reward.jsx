import React, { useEffect, useState } from 'react';
import './Reward.css';
import FlyFR from '../img-jsx-fr/FlyFR';

function Reward({ userData }) {
    const [rewardPoints, setRewardPoints] = useState(userData?.reward_fr || 0);

    useEffect(() => {
        setRewardPoints(userData?.reward_fr || 0);
    }, [userData]);

    return (
        <section className='section-reward'>
            <div className='left-section-gif-reward'>
                <FlyFR />
            </div>
            <div className='mid-section-text-reward'>
                <span>Reward for friends:</span>
                <span className='second-span'>Claim:</span>
            </div>
            <div className='right-section-reward'>
                <span className='span-count'>{rewardPoints}</span>
            </div>
        </section>
    );
}

export default Reward;