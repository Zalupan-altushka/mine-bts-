import React from 'react';
import Star from '../../../Most Used/Image/Star';
import './BoostersBox.css'

function BoostersBox() {

  return (
        <section className='boosters-box'>
          <article className='height-section-box'>
            <div className='left-section-box'>
              <span className='first-span-box'>Boosters Market</span>
              <span className='two-span'>Please buy boosters with TG Stars</span>
            </div>
            <div className='right-section-box'>
              <Star />
            </div>
          </article>
          <div className='polosa' />
          <article className='middle-section-box'>
            <div className='center-section-middle'>
              <div>
                Balance:
                <span className='points-balance'>0.033</span><button className='info-button'>inf</button>
              </div>
              <div>
                Storage:
                <span className='green-background'></span><span className='storage-fill'>100%</span>
              </div>
            </div>
            <button className='Claim-button-br'>🡲 Claim 🡰</button>
          </article>
        </section>
  );
}

export default BoostersBox;
