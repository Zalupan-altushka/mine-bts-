import React from 'react';
import Menu from '../Menus/Menu/Menu';
import Telegram from './Containers/img-jsx-ts/Telegram';
import TonCoin from './Containers/img-jsx-ts/TonCoin';
import TonConnect from './Containers/TonConnect/TonConnect';
import './Tasks.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

function Tasks() {

  return (
    <TonConnectUIProvider manifestUrl="https://bts-best-app.netlify.app/tonconnect-manifest.json">
      <section className='bodytaskspage'>
        <section className='higth-section-slipper'>
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
          <div className='connect-ton'>
            <article className='hight-section-wl'>
              <TonCoin />
              <div className='points-div-bk-wl'>
                <span>+$149 BTS</span>
              </div>
            </article>
            <div className='middle-section-wl'>
              <span>Connect Wallet</span>
            </div>
            <div className='bottom-section-wl'>
              <TonConnect />
            </div>
          </div>
        </section>
        <Menu />
      </section>
    </TonConnectUIProvider>
  );
}

export default Tasks;