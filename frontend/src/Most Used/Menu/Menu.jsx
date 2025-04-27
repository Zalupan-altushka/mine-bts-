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
      event.preventDefault(); // Предотвратить навигацию, если уже на странице
    }
  };

  // Функция для определения стиля иконки
  const getIconStyle = (path) => ({
    boxShadow: currentPath === path ? '0 0 10px #c4f85c' : 'none',
    borderRadius: '50%', // Можно добавить, если нужно
    display: 'inline-block', // Для корректного отображения box-shadow
  });

  return (
    <div className="menu">
      <div className="menu-item">
        <Link to="/" onClick={handleClick('/')}>
          <div style={getIconStyle('/')}>
            {currentPath === '/' ? <HomeIconTwo /> : <HomeIconOne />}
          </div>
          <span
            className="Name"
            style={{
              color: currentPath === '/' ? '#c4f85c' : 'var(--container-color-two)',
            }}
          >
            Home
          </span>
        </Link>
      </div>
      <div className="menu-item">
        <Link to="/friends" onClick={handleClick('/friends')}>
          <div style={getIconStyle('/friends')}>
            {currentPath === '/friends' ? <FriendsIconOne /> : <FriendsIconTwo />}
          </div>
          <span
            className="Name"
            style={{
              color: currentPath === '/friends' ? '#c4f85c' : 'var(--container-color-two)',
            }}
          >
            Friends
          </span>
        </Link>
      </div>
      <div className="menu-item">
        <Link to="/boost" onClick={handleClick('/boost')}>
          <div style={getIconStyle('/boost')}>
            {currentPath === '/boost' ? <BoostIconTwo /> : <BoostIconOne />}
          </div>
          <span
            className="Name"
            style={{
              color: currentPath === '/boost' ? '#c4f85c' : 'var(--container-color-two)',
            }}
          >
            Boost
          </span>
        </Link>
      </div>
      <div className="menu-item">
        <Link to="/tasks" onClick={handleClick('/tasks')}>
          <div style={getIconStyle('/tasks')}>
            {currentPath === '/tasks' ? <TasksIconOne /> : <TasksIconTwo />}
          </div>
          <span
            className="Name"
            style={{
              color: currentPath === '/tasks' ? '#c4f85c' : 'var(--container-color-two)',
            }}
          >
            Tasks
          </span>
        </Link>
      </div>
      <div className="menu-item">
        <Link to="/wallet" onClick={handleClick('/wallet')}>
          <div style={getIconStyle('/wallet')}>
            {currentPath === '/wallet' ? <WalletIconTwo /> : <WalletIconOne />}
          </div>
          <span
            className="Name"
            style={{
              color: currentPath === '/wallet' ? '#c4f85c' : 'var(--container-color-two)',
            }}
          >
            Wallet
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
