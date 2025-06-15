import './Bonus.css'
import DiamondFR from "../../../../Most Used/Image/DiamondFR";

function Bonus() {
  
  return(
    <section>
        <article className='right-section-bonus-fr'>
          <section className='text-section-bonus-fr'>
            <span class="title-how-it-works">How it works?</span>
            <div className='block-text'>
              <span>Share your refferal link!</span>
              <span className='second-span-bonus'>Tap the button bellow</span>
            </div>
            <div className='block-text'>
              <span>Your friends join $BTS</span>
              <span className='second-span-bonus'>And thay start mining </span>
            </div>
            <div className='block-text'>
              <span>Learn & Earn Together!</span>
              <span className='second-span-bonus'>Get points to refferals</span>
            </div>
          </section>
          <section className='left-section-gif-bonus-fr'>
            <DiamondFR />
          </section>
        </article>
    </section>
  );
}

export default Bonus;