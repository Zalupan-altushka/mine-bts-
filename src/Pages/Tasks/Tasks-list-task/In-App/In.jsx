import Telegram from '../../../../Most Used/Image/Telegram';
import './In.css'

function In() {
  return (
    <section className='Tasks_list'>
      <article className='Tasks-in'>
        <div className='left-section-img-in'>
          <Telegram />
        </div>
        <div className='mid-section-in'>
          <span>BTS-OFFICIAL</span>
          <div className='container-about-in'>
            <span>This is the telegram channel</span>
            <span>of this telegram mini app,</span>
            <span>where news will be published.</span>
          </div>
        </div>
        <button className='Visit-button-in'>Visit</button>
      </article>
    </section>
  );
}

export default In;