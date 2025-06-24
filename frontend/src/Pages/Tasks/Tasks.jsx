import React from 'react';
import Menu from '../Menus/Menu/Menu';
import Telegram from './Containers/img-jsx-ts/Telegram';
import './Tasks.css';
import TGcenterLogo from './Containers/img-jsx-ts/TGcenterLogo';

function Tasks() {

  return (
      <section className='bodytaskspage'>
        <div className="mine-tasks-container">
          <h2 className="mine-tasks-title">Mine Tasks</h2>
          <section className="tasks-row">
            <div className='sub-tg'>
              <article className='hight-section-tg'>
                <Telegram />
                <div className='points-div-bk-tg'>
                  <span>+$149 BTS</span>
                </div>
              </article>
              <div className='middle-section-tg'>
                <span>Follow BTS CIS</span>
              </div>
              <div className='bottom-section-tg'>
                <button>Start</button>
              </div>
            </div>
            <div className='tg-center'>
              <article className='hight-section-cr'>
                <TGcenterLogo />
                <div className='points-div-bk-cr'>
                  <span>+$149 BTS</span>
                </div>
              </article>
              <div className='middle-section-cr'>
                <span>Follow App Center</span>
              </div>
              <div className='bottom-section-cr'>
                <button>Start</button>
              </div>
            </div>
          </section>
        </div>
        <Menu />
      </section>
  );
}

export default Tasks;