import './Boosters.css'
import Menu from '../../Most Used/Menu/Menu';
import ListContainetThree from '../Boosters-list/ListContainetThree';
import ListsContainerFirst from '../Boosters-list/ListContainerFirst';
import ListsContainerSecond from '../Boosters-list/ListContainerSecond';
import BoostersBox from './Containers/BoostersBox';

function Boosters({ userData }) {

  return (
    <section className='bodyboostpage'>
      <BoostersBox />
      <div className='containers-scroll-wrapper'>
        <div className='center-content'>
          <ListsContainerFirst />
          <ListsContainerSecond />
          <ListContainetThree />
        </div>
      </div>
      <Menu />
    </section>
  );
}

export default Boosters;