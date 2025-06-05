import React, { useState } from 'react';
import './Boosters.css';
import Menu from '../../Most Used/Menu/Menu';
import ListContainerThree from '../Boosters-list/ListContainerThree';
import ListsContainerFirst from '../Boosters-list/ListContainerFirst';
import ListContainerSecond from '../Boosters-list/ListContainerSecond';
import BoostersBox from './Containers/BoostersBox';
import { Telegram } from '@telegram-apps/sdk';

const telegram = Telegram.WebApp;

function Boosters({ userData }) {
  const [boosters, setBoosters] = useState({
    ton: { active: false, power: 0.072, cost: 700 },
    apps: { active: false, power: 18.472, cost: 1500 },
    prem: { active: false, power: 38.172, cost: 2700 },
    eth: { active: false, power: 48.472, cost: 3900 },
    btc: { active: false, power: 68.172, cost: 5900 },
  });

  const activateBooster = async (boosterName) => {
    const booster = boosters[boosterName];
    if (booster.active) return;

    try {
      const result = await telegram.invokeMethod('pay', {
        amount: booster.cost,
        currency: 'XTR',
        description: `Activate ${boosterName} booster`,
      });

      if (result.status === 'ok') {
        setBoosters((prevBoosters) => ({
          ...prevBoosters,
          [boosterName]: { ...prevBoosters[boosterName], active: true },
        }));
      } else {
        console.error('Payment failed:', result);
      }
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  return (
    <section className='bodyboostpage'>
      <BoostersBox />
      <div className='containers-scroll-wrapper'>
        <div className='center-content'>
          <ListsContainerFirst boosters={boosters} activateBooster={activateBooster} />
          <ListContainerSecond boosters={boosters} activateBooster={activateBooster} />
          <ListContainerThree boosters={boosters} activateBooster={activateBooster} />
        </div>
      </div>
      <Menu />
    </section>
  );
}

export default Boosters;