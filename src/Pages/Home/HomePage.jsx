import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import GrHeart from '../../Most Used/Image/GrHeart';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram.WebApp;

function HomePage() {
  const [points, setPoints] = useState(0);
  const [userId, setUserId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isClaimButton, setIsClaimButton] = useState(true);
  const [timerInterval, setTimerInterval] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (tg) {
      const user = tg.initDataUnsafe?.user;
      if (user) {
        const id = user.id;
        setUserId(id);
        // Попытка получить очки из localStorage
        const storedPoints = localStorage.getItem(`points_${id}`);
        if (storedPoints !== null) {
          setPoints(parseFloat(storedPoints));
        } else {
          fetchUserPoints(id);
        }
      }
    }
  
    // Восстановление таймера (оставьте как есть)
    const endTimeStr = localStorage.getItem('endTime');
    if (endTimeStr) {
      const endTime = parseInt(endTimeStr, 10);
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(remaining);
      setIsButtonDisabled(remaining > 0);
      setIsClaimButton(remaining <= 0);
      if (remaining > 0) {
        startTimer(remaining);
      } else {
        localStorage.removeItem('endTime');
      }
    }
  }, []);

  const fetchUserPoints = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}`);
      if (response.data && response.data.points !== undefined) {
        setPoints(response.data.points);
        localStorage.setItem(`points_${userId}`, response.data.points.toString());
      }
    } catch (error) {
      console.error('Ошибка при получении очков:', error);
    }
  };

  const updatePointsInDB = async (newPoints) => {
    try {
      await axios.post(`${API_URL}/api/user/${userId}`, { points: newPoints });
    } catch (error) {
      console.error('Ошибка при обновлении очков:', error);
    }
  };

  const startTimer = (duration) => {
    const endTime = Date.now() + duration * 1000;
    localStorage.setItem('endTime', endTime);
    const interval = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(remainingTime);
      if (remainingTime === 0) {
        clearInterval(interval);
        localStorage.removeItem('endTime');
        setIsButtonDisabled(false);
        setIsClaimButton(true);
      }
    }, 1000);
    setTimerInterval(interval);
  };

  const handlePointsUpdate = (amount) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    if (userId) {
      localStorage.setItem(`points_${userId}`, newPoints.toString());
      updatePointsInDB(newPoints);
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
    setPoints(newPoints);
    if (userId) {
      localStorage.setItem(`points_${userId}`, newPoints.toString());
      updatePointsInDB(newPoints);
    }
    setIsClaimButton(false);
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
      <Game />
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

