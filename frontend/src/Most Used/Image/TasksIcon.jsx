import React from 'react';
import TasksGray from './TasksGray.svg'; 

function TasksIconOne() {

  return(
    <div>
      <img src={TasksGray} alt="Star" style={{ width: '16px', height: '16px' }}/>
    </div>
  );
}

export default TasksIconOne;