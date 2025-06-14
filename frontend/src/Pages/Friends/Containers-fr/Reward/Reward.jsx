import React from 'react';
import Fly from '../../../../Most Used/Image/Fly';
import './Reward.css';

function Reward({ userData }) {
    const reward = userData?.reward_fr || 0; // Получаем значение reward_fr из userData или устанавливаем 0 по умолчанию

    return (
        <section className='reward-section-fr'>
            <article className='left-section-reward-fr'>
                <span className='title-total-frends'>Your total reward!</span>
                <span className='span-reward-fr'>{reward}</span>
                <span className='span-about-fr'>+205.033 BTS for friend</span>
            </article>
            <article className='right-section-reward-fr'>
                <Fly />
            </article>
        </section>
    );
}

export default Reward;