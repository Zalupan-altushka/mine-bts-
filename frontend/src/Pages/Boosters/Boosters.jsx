import './Boosters.css'
import Menu from '../../Most Used/Menu/Menu';
import ListContainerThree from '../Boosters-list/ListContainetThree';
import ListsContainerFirst from '../Boosters-list/ListContainerFirst';
import ListsContainerSecond from '../Boosters-list/ListContainerSecond';
import Star from '../../Most Used/Image/Star';

function Boosters() {

  return (
      <section className='bodyboostpage'>
        <div className='margin-div-boost'></div>
        <section className='boosters-box'>
          <article className='height-section-box'>
            <div className='left-section-box'>
              <span className='first-span'>Boosters Market</span>
              <span className='two-span'>Please buy boosters with TG Stars</span>
            </div>
            <div className='right-section-box'>
              <Star />
            </div>
          </article>
          <div className='polosa' />
          <article className='middle-section-box'>
            <div className='center-section-middle'>
              <span>Balance: 0.0333</span>
            </div>
            <button>Claim</button>
          </article>
        </section>
        <div className='containers-scroll-wrapper'>
          <div className='center-content'>
            <ListsContainerFirst />
            <ListsContainerSecond />
            <ListContainerThree />
          </div>
        </div>
        <Menu />
      </section>
  );
}

export default Boosters;