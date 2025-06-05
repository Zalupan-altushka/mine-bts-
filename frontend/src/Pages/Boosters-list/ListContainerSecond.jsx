import React from 'react';
import CenterApp from '../../Most Used/Image/CenterApp';
import Premium from '../../Most Used/Image/Premium';

function ListContainerSecond({ boosters, activateBooster }) {
  const handleActivateApps = () => {
    activateBooster('apps');
  };

  const handleActivatePrem = () => {
    activateBooster('prem');
  };

  return (
    <section className='lists-container'>
      <article className='boosters-list-center'>
        <div className='list'>
          <div className='hight-section-list'>
            <span>Apps</span>
            <button className='ListButtonCenter' onClick={handleActivateApps}>
              {boosters.apps.active ? 'Active' : `${boosters.apps.cost / 1000}K`}
            </button>
          </div>
          <section className='mid-section-list'>
            <CenterApp />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-center'>{boosters.apps.power} BTS/hr</span>
          </div>
        </div>
      </article>
      <article className='boosters-list-prm'>
        <div className='list'>
          <div className='hight-section-list'>
            <span>Prem</span>
            <button className='ListButtonPrm' onClick={handleActivatePrem}>
              {boosters.prem.active ? 'Active' : `${boosters.prem.cost / 1000}K`}
            </button>
          </div>
          <section className='mid-section-list'>
            <Premium />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-bts'>{boosters.prem.power} BTS/hr</span>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ListContainerSecond;