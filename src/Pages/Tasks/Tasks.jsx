import './Tasks.css'
import In from './Tasks-list-task/In-App/In';
import Special from './Tasks-list-task/Special/Special';
import Menu from '../../Most Used/Menu/Menu';
import { useState } from 'react';


function Tasks() {
  const [activeContent, setActiveContent] = useState('button1'); // или другой элемент по умолчанию
  const [activeButton, setActiveButton] = useState('button1');

  const handleButtonClick = (button) => {
    setActiveContent(button);
    setActiveButton(button);
  };
  
  return (
      <section className='bodytaskspage'>
        <article className="button-container-tasks">
          <button 
            className={activeButton === 'button1' ? 'active' : ''} 
            onClick={() => handleButtonClick('button1')}
          >
            Special
          </button>
          <button 
            className={activeButton === 'button2' ? 'active' : ''} 
            onClick={() => handleButtonClick('button2')}
          >
            In-App
          </button>
          <button 
            className={activeButton === 'button3' ? 'active' : ''} 
            onClick={() => handleButtonClick('button3')}
          >
            Partners
          </button>
        </article>
        <section className="content">
          {activeContent === 'button1' && <Special />}
          {activeContent === 'button2' && <In />}
          {activeContent === 'button3' && <div></div>}
        </section>
        <Menu />
      </section>
  );
}

export default Tasks