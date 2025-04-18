import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import GrHeart from '../../Most Used/Image/GrHeart';

const tg = window.Telegram.WebApp;

function HomePage() {
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseFloat(savedPoints) : 0.0333; // Initial points are 0.0333
  });
  const [userId, setUserId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const savedTime = localStorage.getItem('timeRemaining');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [isClaimButton, setIsClaimButton] = useState(() => {
    const savedClaimButtonState = localStorage.getItem('isClaimButton');
    return savedClaimButtonState === 'true'; // Convert string to boolean
  });
  const [timerInterval, setTimerInterval] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (tg) {
      const user = tg.initDataUnsafe?.user;
      if (user) {
        const id = user.id;
        setUserId(id);
        // Отправляем данные о пользователе на сервер
        sendUserData(id);
        // Получаем текущие очки пользователя
        fetchUserPoints(id);
      }
    }

    // Восстановление таймера из localStorage
    const endTime = localStorage.getItem('endTime');
    if (endTime) {
      const remainingTime = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
      setTimeRemaining(remainingTime);
      setIsButtonDisabled(remainingTime > 0);
      setIsClaimButton(remainingTime <= 0);
      if (remainingTime > 0) {
        startTimer(remainingTime);
      } else {
        localStorage.removeItem('endTime');
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  const sendUserData = async (userId) => {
    try {
      await axios.post(`${API_URL}/api/user`, { userId, points: 0.0333 });
    } catch (error) {
      console.error('Ошибка при отправке данных пользователя:', error);
    }
  };

  const fetchUserPoints = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}`);
      if (response.data && response.data.points !== undefined) {
        setPoints(response.data.points);
        localStorage.setItem('points', response.data.points);
      }
    } catch (error) {
      console.error('Ошибка при получении очков:', error);
    }
  };

  const startTimer = (duration) => {
    const endTime = Date.now() + duration * 1000;
    localStorage.setItem('endTime', endTime);
    const interval = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(remainingTime);
      localStorage.setItem('timeRemaining', remainingTime);
      setIsButtonDisabled(remainingTime > 0);
      const claimButtonState = remainingTime <= 0;
      setIsClaimButton(claimButtonState);
      localStorage.setItem('isClaimButton', claimButtonState);
      if (remainingTime <= 0) {
        clearInterval(interval);
        localStorage.removeItem('endTime');
      }
    }, 1000);
    setTimerInterval(interval);
  };

  const handlePointsUpdate = (amount) => {
    const newPoints = points + amount;
    updatePoints(newPoints);
  };

  const updatePoints = (newPoints) => {
    setPoints(newPoints);
    localStorage.setItem('points', newPoints);
    if (userId) {
      saveUserData(userId, newPoints);
    }
  };

  const handleMineFor100 = () => {
    setIsButtonDisabled(true);
    const sixHoursInSeconds = 6 * 60 * 60;
    setTimeRemaining(sixHoursInSeconds);
    startTimer(sixHoursInSeconds);
  };

  const handleClaimPoints = () => {
    const newPoints = points + 52.033;
    updatePoints(newPoints);
    setIsClaimButton(false);
    localStorage.setItem('isClaimButton', false);
  };

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <section className='bodyhomepage'>
      <div className='margin-div'></div>
      <div className='for-margin-home'></div>
      <span className='points-count'>{points.toFixed(4)}</span>
      <DayCheck onPointsUpdate={handlePointsUpdate} />
      <div className='container-game'>
        <div className='left-section-gif-game'>
          <GrHeart />
        </div>
        <div className='mid-section-textabout-game'>
          <span className='first-span-game'>Mini Game</span> 
          <span className='second-span-game'>
            <span>Coming soon...</span>
          </span>
        </div>
        <div className='right-section-button-game'>
          <button className='Game-button'>?</button>
        </div>
      </div>
      <BoosterContainer />
      <FriendsConnt />
      <div className='ButtonGroup'>
        <button
          className='FarmButton'
          onClick={isClaimButton ? handleClaimPoints : handleMineFor100}
          disabled={isButtonDisabled && !isClaimButton}
          style={{
            backgroundColor: isClaimButton ? 'white' : (isButtonDisabled ? '#c4f85c' : ''),
            color: isClaimButton ? 'black' : (isButtonDisabled ? 'black' : ''),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isButtonDisabled && !isClaimButton && <Timer style={{ marginRight: '8px' }} />}
          {isClaimButton ? 'Claim 52.033 BTS' : (isButtonDisabled ? formatTime(timeRemaining) : 'Mine 52.033 BTS')}
        </button>
      </div>
      <Menu />
    </section>
  );
}

export default HomePage;


