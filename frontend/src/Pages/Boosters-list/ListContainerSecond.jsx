import React from 'react';
import CenterApp from '../../Most Used/Image/CenterApp';
import Premium from '../../Most Used/Image/Premium';


function ListContainerSecond() {

  return(
    <section className='lists-container'>
      <article className='boosters-list-center'>
        <div className='list'>
          <div className='hight-section-list'>
            <span>Apps</span>
            <button className='ListButtonCenter'>1.5K</button>
          </div>
          <section className='mid-section-list'>
            <CenterApp />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-center'>18.472 BTS/hr</span>
          </div>
        </div>
      </article>
      <article className='boosters-list-prm'>
        <div className='list'>
          <div className='hight-section-list'>
            <span>Prem</span>
            <button className='ListButtonPrm'>2.7k</button>
          </div>
          <section className='mid-section-list'>
            <Premium />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-bts'>38.172 BTS/hr</span>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ListContainerSecond;