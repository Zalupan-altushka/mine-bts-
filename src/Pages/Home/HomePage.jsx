import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram.WebApp;
// Укажите URL вашего API
const API_URL = 'http://localhost:5000';// Замените на ваш реальный URL

function HomePage() {
  const [points, setPoints] = useState(0);
  const [userId, setUserId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isClaimButton, setIsClaimButton] = useState(true);
  const [timerInterval, setTimerInterval] = useState(null);

  // Получение данных при загрузке
  useEffect(() => {
    if (tg) {
      const user = tg.initDataUnsafe?.user;
      if (user) {
        const id = user.id;
        setUserId(id);
        fetchUserPoints(id);
      }
    }

    // Восстановление таймера из localStorage
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

  // Функция для получения очков из API
  const fetchUserPoints = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}`);
      if (response.data && response.data.points !== undefined) {
        setPoints(response.data.points);
      }
    } catch (error) {
      console.error('Ошибка при получении очков:', error);
    }
  };

  // Обновление очков в базе при их изменении
  useEffect(() => {
    if (userId) {
      axios.post(`${API_URL}/api/user/${userId}/update-points`, { points })
        .catch(error => console.error('Ошибка при сохранении очков:', error));
    }
  }, [points, userId]);

  // Таймер
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

  // Обработчик для "Mine"
  const handleMineFor100 = () => {
    setIsButtonDisabled(true);
    const sixHoursInSeconds = 6 * 60 * 60;
    setTimeRemaining(sixHoursInSeconds);
    startTimer(sixHoursInSeconds);
  };

  // Обработчик для "Claim"
  const handleClaimPoints = () => {
    const newPoints = points + 52.033;
    setPoints(newPoints);
    setIsClaimButton(false);
  };

  // Форматирование времени
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
      
      {/* Другие компоненты */}
      <DayCheck onPointsUpdate={(amount) => setPoints(prev => prev + amount)} />
      <Game />
      <BoosterContainer />
      <FriendsConnt />

      {/* Кнопка */}
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
