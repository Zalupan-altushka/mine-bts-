import React from 'react';
import Fly from '../../../../Most Used/Image/Fly';
import './Reward.css';

function Reward() {
  return (
    <section className='reward-section-fr'>
      <article className='left-section-reward-fr'>
        <span className='title-total-frends'>Your total reward!</span>
        <span className='span-reward-fr'>0</span>
        <span className='span-about-fr'>+205.033 BTS for friend</span>
      </article>
      <article className='right-section-reward-fr'>
        <Fly />
      </article>
    </section>
  );
}

export default Reward;