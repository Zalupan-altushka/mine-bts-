import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.css';
import HomeIconOne from '../Image/HomeIcon';
import HomeIconTwo from '../Image/HomeIconTwo';
import FriendsIconOne from '../Image/FriendsIcon';
import FriendsIconTwo from '../Image/FriendsIconTwo';
import TasksIconOne from '../Image/TasksIcon';
import TasksIconTwo from '../Image/TasksIconTwo';
import BoostIconOne from '../Image/ZapIcon';
import BoostIconTwo from '../Image/ZapIconTwo';
import WalletIconOne from '../Image/WalletIconOne';
import WalletIconTwo from '../Image/WalletIcomTwo';


const Menu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleClick = (path) => (event) => {
    if (currentPath === path) {
      event.preventDefault(); // Prevent navigation if the same path is clicked
    }
  };

  return (
      <div className="menu">
        <div className="menu-item">
          <Link to="/" onClick={handleClick('/')}>
            {currentPath === '/' ? <HomeIconTwo /> : <HomeIconOne />}
            <span className="Name" style={{ color: currentPath === '/' ? '#c4f85c' : 'var(--container-color-two)' }}>
              Home
            </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/friends" onClick={handleClick('/friends')}>
            {currentPath === '/friends' ? <FriendsIconOne /> : <FriendsIconTwo/>}
            <span className="Name" style={{ color: currentPath === '/friends' ? '#c4f85c' : 'var(--container-color-two)' }}>
              Friends
            </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/boost" onClick={handleClick('/boost')}>
            {currentPath === '/boost' ? <BoostIconTwo /> : <BoostIconOne />}
            <span className="Name" style={{ color: currentPath === '/boost' ? '#c4f85c' : 'var(--container-color-two)' }}>
              Boost
            </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/tasks" onClick={handleClick('/tasks')}>
            {currentPath === '/tasks' ? <TasksIconOne /> : <TasksIconTwo />}
            <span className="Name" style={{ color: currentPath === '/tasks' ? '#c4f85c' : 'var(--container-color-two)' }}>
              Tasks
            </span>
          </Link>
        </div>
      </div>
  );
};

export default Menu;

