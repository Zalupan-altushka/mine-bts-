import BeachGIF from '../../../../Most Used/Image/BeachGIF';
import './TotalFR.css'

function TotalFR() {

  return(
    <section className='section-total'>
      <div className='left-section-gif-fr'>
        <BeachGIF />
      </div>
      <div className='mid-section-text-fr'>
        <span>Let's invite frends!</span>
        <span className='second-span'>Total friends:</span>
      </div>
      <div className='right-section-total-fr'>
        <span className='span-count'>0</span>
      </div>
    </section>
  );
}

export default TotalFR;