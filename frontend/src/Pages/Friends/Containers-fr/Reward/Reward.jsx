import React, { useEffect, useState } from 'react';
import Fly from '../../../../Most Used/Image/Fly';
import './Reward.css';

function Reward() {
  const [totalReward, setTotalReward] = useState(0);

  useEffect(() => {
    const reward = localStorage.getItem('total_reward');
    if (reward) {
      setTotalReward(parseFloat(reward));
    }
  }, []);

  return (
    <section className='reward-section-fr'>
      <article className='left-section-reward-fr'>
        <span className='title-total-frends'>Your total reward!</span>
        <span className='span-reward-fr'>{totalReward.toFixed(3)}</span>
        <span className='span-about-fr'>+205.033 BTS for friend</span>
      </article>
      <article className='right-section-reward-fr'>
        <Fly />
      </article>
    </section>
  );
}

export default Reward;