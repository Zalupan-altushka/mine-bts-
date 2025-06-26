import './Middle.css';
import Telegram from '../img-jsx-ts/Telegram';
import { TonConnectButton } from '@tonconnect/ui-react'
import TonBrand from '../img-jsx-ts/TonBrand';

function Middle() {
  return (
    <section className='wallet'>
      <article className='left-section-wallet'>
        <div className='hight-section-wallet'>

          <div className='points-div-bk-wallet'>
            <span>+$349 BTS</span>
          </div>
        </div>
        <div className='middle-section-wallet'>
          <span>Connect your wallet</span>
        </div>
        <div className='bottom-section-wallet'>
          <TonConnectButton />
        </div>
      </article>
      <article className='right-section-wallet'>
        <TonBrand />
      </article>
    </section>
  );
}

export default Middle;