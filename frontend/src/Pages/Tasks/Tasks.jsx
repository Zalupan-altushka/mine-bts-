import Menu from '../Menus/Menu/Menu';
import './Tasks.css';
import Middle from './Containers/Middle-section/Middle';
import Hight from './Containers/Hight-section/Hight';

function Tasks() {

  return (
      <section className='bodytaskspage'>
        <Hight />
        <Middle />
        <Menu />
      </section>
  );
}

export default Tasks;