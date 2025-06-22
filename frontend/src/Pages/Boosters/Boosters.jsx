import './Boosters.css';
import BoostersBox from './Containers/BoostersBox';
import Menu from '../Menus/Menu/Menu';
import ListsContainerFirst from './Boosters-list/ListContainerFirst';
import ListContainerSecond from './Boosters-list/ListContainerSecond';
import ListContainerThree from './Boosters-list/ListContainerThree';

function Boosters({ isActive, userData, updateUserData }) {
    return (
        <section className='bodyboostpage'>
            <BoostersBox userData={userData} />
            <div className='containers-scroll-wrapper'>
                <div className='center-content'>
                    <ListsContainerFirst isActive={isActive} userData={userData} />
                    <ListContainerSecond isActive={isActive} userData={userData} updateUserData={updateUserData} /> 
                    <ListContainerThree isActive={isActive} userData={userData} updateUserData={updateUserData} /> 
                </div>
            </div>
            <Menu />
        </section>
    );
}

export default Boosters;
