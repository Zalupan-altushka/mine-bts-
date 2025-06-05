import React from 'react';
import TON from '../../Most Used/Image/TON';

function ListsContainerFirst({ boosters, activateBooster }) {
  const handleActivate = () => {
    activateBooster('ton');
  };

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button className='ListButtonTon' onClick={handleActivate}>
              {boosters.ton.active ? 'Active' : `${boosters.ton.cost / 1000}K`}
            </button>
          </div>
          <section className='mid-section-list'>
            <TON />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-ton'>{boosters.ton.power} BTS/hr</span>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ListsContainerFirst;