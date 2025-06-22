import './Boosters.css'
import ListContainerThree from './Boosters-list/ListContainerThree';
import ListsContainerFirst from './Boosters-list/ListContainerFirst';
import ListsContainerSecond from './Boosters-list/ListsContainerSecond';
import BoostersBox from './Containers/BoostersBox';
import Menu from '../Menus/Menu/Menu';

function Boosters({ isActive, userData }) {

  return (
    <section className='bodyboostpage'>
      <BoostersBox />
      <div className='containers-scroll-wrapper'>
        <div className='center-content'>
          <ListsContainerFirst isActive={isActive} userData={userData} />
          <ListsContainerSecond isActive={isActive} userData={userData} />
          <ListContainerThree isActive={isActive} userData={userData} />
        </div>
      </div>
      <Menu />
    </section>
  );
}

export default Boosters;