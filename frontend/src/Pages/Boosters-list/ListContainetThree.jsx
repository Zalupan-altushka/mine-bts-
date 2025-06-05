import React from 'react';
import './List.css';
import Ethereum from '../../Most Used/Image/Ethereum';
import Bitcoin from '../../Most Used/Image/Bitcoin';

function ListContainerThree({ boosters, activateBooster }) {
  const handleActivateETH = () => {
    activateBooster('eth');
  };

  const handleActivateBTC = () => {
    activateBooster('btc');
  };

  return (
    <section className='lists-container'>
      <article className='boosters-list-ETH'>
        <section className='list'>
          <div className='hight-section-list'>
            <span>ETH</span>
            <button className='ListButtonETH' onClick={handleActivateETH}>
              {boosters.eth.active ? 'Active' : `${boosters.eth.cost / 1000}K`}
            </button>
          </div>
          <div className='mid-section-list'>
            <Ethereum />
          </div>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-ETH'>{boosters.eth.power} BTS/hr</span>
          </div>
        </section>
      </article>
      <article className='boosters-list-BTS'>
        <section className='list'>
          <div className='hight-section-list'>
            <span>BTC</span>
            <button className='ListButtonBTC' onClick={handleActivateBTC}>
              {boosters.btc.active ? 'Active' : `${boosters.btc.cost / 1000}K`}
            </button>
          </div>
          <section className='mid-section-list'>
            <Bitcoin />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-BTS'>{boosters.btc.power} BTS/hr</span>
          </div>
        </section>
      </article>
    </section>
  );
}

export default ListContainerThree;