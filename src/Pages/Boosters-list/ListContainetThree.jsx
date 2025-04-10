import React from 'react';
import './List.css'
import Ethereum from '../../Most Used/Image/Ethereum';
import Bitcoin from '../../Most Used/Image/Bitcoin';


function ListContainerThree() {

  return(
    <section className='lists-container'>
      <article className='boosters-list-ETH'>
        <section className='list'>
          <div className='hight-section-list'>
            <span>ETH</span>
            <button className='ListButtonETH'>3.9K</button>
          </div>
          <div className='mid-section-list'>
            <Ethereum />
          </div>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-ETH'>48.472 BTS/hr</span>
          </div>
        </section>
      </article>
      <article className='boosters-list-BTS'>
        <section className='list'>
          <div className='hight-section-list'>
            <span>BTC</span>
            <button className='ListButtonBTC'>5.9k</button>
          </div>
          <section className='mid-section-list'>
            <Bitcoin />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-BTS'>68.172 BTS/hr</span>
          </div>
        </section>
      </article>
    </section>
  );
}

export default ListContainerThree;