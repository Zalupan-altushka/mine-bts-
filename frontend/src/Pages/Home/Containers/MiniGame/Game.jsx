import GrHeartHome from '../img-jsx/GrHeartHome';
import './Game.css';

function Game() {

  return (
    <div className='container-game'>
        <div className='left-section-gif-game'>
          <GrHeartHome />
        </div>
        <div className='mid-section-textabout-game'>
          <span className='first-span-game'>Mini Game!</span> 
          <span className='second-span-game'>
            <span>Coming soon...</span>
          </span>
        </div>
        <div className='right-section-button-game'>
          <button className='Game-button'>?</button>
        </div>
    </div>
  );
}

export default Game;