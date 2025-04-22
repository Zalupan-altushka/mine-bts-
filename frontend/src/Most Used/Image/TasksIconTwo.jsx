import React from 'react';
import TasksGreen from './TasksGreen.svg'; 

function TasksIconTwo() {

  return(
    <div>
      <img src={TasksGreen} alt="Star" style={{ width: '16px', height: '16px' }}/>
    </div>
  );
}

export default TasksIconTwo;