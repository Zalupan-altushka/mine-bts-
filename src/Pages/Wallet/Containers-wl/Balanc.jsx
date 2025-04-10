import WalletFor from '../../../Most Used/Image/WalletFor';
import ZaapFor from '../../../Most Used/Image/ZaapFor';
import './Balanc.css';

function Balanc({ points }) { // Accept points as a prop
  return (
    <article className='for-margin'>
      <div className='balans-container'>
        <article className='left-section-wallet'>
          <WalletFor />
          <span>Balance</span>
        </article>
        <article className='right-section-wallet'>
          <span>{points.toFixed(4)} BTS</span> {/* Display the points */}
        </article>
      </div>
      <div className='balans-container'>
        <article className='left-section-wallet'>
          <ZaapFor />
          <span>Boosters</span>
        </article>
        <article className='right-section-wallet'>
          <span>2</span>
        </article>
      </div>
    </article>
  );
}

export default Balanc;