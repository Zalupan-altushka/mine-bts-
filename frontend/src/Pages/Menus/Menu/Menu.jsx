import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.css';
import HomeIconOneMenu from '../img-jsx/HomeIconOneMenu';
import HomeIconTwoMenu from '../img-jsx/HomeIconTwoMenu';
import FriendsIconOneMenu from '../img-jsx/FriendsIconMenu';
import FriendsIconTwoMenu from '../img-jsx/FriendsIconTwoMenu';
import BoostIconOneMenu from '../img-jsx/BoostIconOneMenu';
import BoostIconTwoMenu from '../img-jsx/BoostIconTwoMenu';
import TasksIconOneMenu from '../img-jsx/TasksIconMenu';
import TasksIconTwoMenu from '../img-jsx/TasksIconTwoMenu';

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
            {currentPath === '/' ? <HomeIconTwoMenu /> : <HomeIconOneMenu />}
            <span className="Name" style={{ color: currentPath === '/' ? '#c4f85c' : 'var(--container-color-two)' }}>
              Home
            </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/friends" onClick={handleClick('/friends')}>
            {currentPath === '/friends' ? <FriendsIconOneMenu /> : <FriendsIconTwoMenu />}
            <span className="Name" style={{ color: currentPath === '/friends' ? '#c4f85c' : 'var(--container-color-two)' }}>
              Friends
            </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/boost" onClick={handleClick('/boost')}>
            {currentPath === '/boost' ? <BoostIconTwoMenu /> : <BoostIconOneMenu />}
            <span className="Name" style={{ color: currentPath === '/boost' ? '#c4f85c' : 'var(--container-color-two)' }}>
              Boost
            </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/tasks" onClick={handleClick('/tasks')}>
            {currentPath === '/tasks' ? <TasksIconOneMenu /> : <TasksIconTwoMenu />}
            <span className="Name" style={{ color: currentPath === '/tasks' ? '#c4f85c' : 'var(--container-color-two)' }}>
              Tasks
            </span>
          </Link>
        </div>
      </div>
  );
};

export default Menu;

