import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect } from 'react';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram?.WebApp;

function HomePage() {
  const userId = localStorage.getItem('userId');

  // Загружаем очки из localStorage или устанавливаем начальные
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseFloat(savedPoints) : 0.033;
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mode, setMode] = useState('mine'); // 'mine' или 'claim'
  const [timerInterval, setTimerInterval] = useState(null);
  const [hitAnimation, setHitAnimation] = useState(false); // Для эффекта удара

  // Загружаем таймер при монтировании компонента
  useEffect(() => {
    const endTimeStr = localStorage.getItem('endTime');
    if (endTimeStr) {
      const endTime = parseInt(endTimeStr, 10);
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining > 0) {
        setIsButtonDisabled(true);
        setMode('mine');
        startTimer(remaining);
      } else {
        localStorage.removeItem('endTime');
        setMode('claim'); // Таймер завершен, показываем "Claim"
      }
    }
  }, []);

  // Функция запуска таймера
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
        setMode('claim'); // Таймер завершен, показываем "Claim"
      }
    }, 1000);
    setTimerInterval(interval);
  };

  // Обработчик для "Mine"
  const handleMineFor100 = () => {
    // Эффект удара
    setHitAnimation(true);
    setTimeout(() => setHitAnimation(false), 300);

    // Не добавляем очки при "Mine"
    const bonusPoints = 52.033;
    // Очки не меняем
    const newPoints = points;
    setPoints(newPoints);
    sendUserData({ id: userId, points: newPoints });

    // Запускаем таймер на 6 часов
    const sixHoursInSeconds = 6 * 60 * 60;
    setIsButtonDisabled(true);
    setMode('mine');
    startTimer(sixHoursInSeconds);
  };

  // Обработчик для "Claim"
  const handleClaimPoints = () => {
    const bonusPoints = 52.033;
    const newPoints = points + bonusPoints;
    setPoints(newPoints);
    localStorage.setItem('points', newPoints);
    sendUserData({ id: userId, points: newPoints });
    setMode('mine'); // Возвращаемся к режиму "Mine"
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <section className='bodyhomepage'>
      <div className='margin-div'></div>
      <span className='points-count'>{points.toFixed(4)}</span>
      <DayCheck onPointsUpdate={(amount) => setPoints(prev => prev + amount)} />
      <Game />
      <BoosterContainer />
      <FriendsConnt />
      <div className='ButtonGroup'>
        <button
          className={`FarmButton ${hitAnimation ? 'hit-effect' : ''}`}
          onClick={() => {
            if (mode === 'claim') {
              handleClaimPoints();
            } else if (mode === 'mine') {
              handleMineFor100();
            }
          }}
          disabled={isButtonDisabled}
          style={{
            backgroundColor: '#c4f85c',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Пока таймер идет, показываем таймер */}
          {isButtonDisabled && mode === 'mine' && <Timer style={{ marginRight: '8px' }} />}
          
          {/* Текст кнопки зависит от режима */}
          {mode === 'mine' ? 'Mine 52.033 BTS' : 'Claim 52.033 BTS'}
          
          {/* Если режим "mine" и таймер активен, показываем оставшееся время */}
          {mode === 'mine' && isButtonDisabled && (
            <span style={{ marginLeft: '8px' }}>{formatTime(timeRemaining)}</span>
          )}
        </button>
      </div>
      <Menu />
    </section>
  );
}

export default HomePage;


