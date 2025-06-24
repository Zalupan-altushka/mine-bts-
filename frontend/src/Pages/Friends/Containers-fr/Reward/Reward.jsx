import React, { useEffect, useState } from 'react';
import './Reward.css';
import FlyFR from '../img-jsx-fr/FlyFR';

function Reward({ userData }) {
    const [rewardPoints, setRewardPoints] = useState(userData?.reward_fr || 0);

    useEffect(() => {
        setRewardPoints(userData?.reward_fr || 0);
    }, [userData]);

    return (
        <section className='reward-section-fr'>
            <article className='left-section-reward-fr'>
                <span className='title-total-frends'>Your total reward!</span>
                <span className='span-reward-fr'>{rewardPoints}</span>
                <span className='span-about-fr'>+205.033 BTS for friend</span>
            </article>
            <article className='right-section-reward-fr'>
                <FlyFR />
            </article>
        </section>
    );
}

export default Reward;