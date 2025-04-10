import React, {useState} from 'react';
import './Boosters.css'
import Menu from '../../Most Used/Menu/Menu';
import ListContainerThree from '../Boosters-list/ListContainetThree';
import ListsContainerFirst from '../Boosters-list/ListContainerFirst';
import ListsContainerSecond from '../Boosters-list/ListContainerSecond';
import ModalOne from '../../Most Used/Modal/ModalOne/ModalOne';
import ModalTwo from '../../Most Used/Modal/ModalTwo/ModalTwo';

function Boosters() {
  const [isModalOneVisible, setModalOneVisible] = useState(false);
  const [isModalTwoVisible, setModalTwoVisible] = useState(false);

  return (
      <section className='bodyboostpage'>
        <section className='Clame_Box'>
          <article className='left-section'>
            <span>Balance: <span className='Points-balance'>0.033</span></span>
            <span>Storage: <span className='Points-balance'>0%</span></span>
          </article>
          <article className='right-section'>
            <button className='right-buttons' onClick={() => setModalOneVisible(true)}>Storage X2</button>
            <button className='right-buttons' onClick={() => setModalTwoVisible(true)}>Time waiting</button>
          </article>
          <button className='Boost_clame_button'>Claim BTS</button>
        </section>
        <ListsContainerFirst />
        <ListsContainerSecond />
        <ListContainerThree />
        <Menu />
        <ModalOne isVisible={isModalOneVisible} onClose={() => setModalOneVisible(false)} />
        <ModalTwo isVisible={isModalTwoVisible} onClose={() => setModalTwoVisible(false)} />
      </section>
  );
}

export default Boosters;