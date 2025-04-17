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

function HomePage({ userId }) {
  const [points, setPoints] = useState(0.0333);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isClaimButton, setIsClaimButton] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    fetchUserData(userId);
  
    // Восстановление состояния таймера и кнопок из CloudStorage
    tg.CloudStorage.getItem('endTime', (error, endTime) => {
      if (endTime) {
        const remainingTime = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
        if (remainingTime > 0) {
          setTimeRemaining(remainingTime);
          setIsButtonDisabled(true);
          setIsClaimButton(false);
          startTimer(remainingTime);
        } else {
          // Время истекло, очищаем
          tg.CloudStorage.removeItem('endTime');
          setIsButtonDisabled(false);
          setIsClaimButton(true);
          setTimeRemaining(0);
        }
      } else {
        // Нет endTime, восстанавливаем состояние кнопки
        tg.CloudStorage.getItem('isClaimButton', (err, claimState) => {
          if (claimState !== null) {
            setIsClaimButton(claimState === 'true');
          }
        });
        tg.CloudStorage.getItem('isButtonDisabled', (err, disabledState) => {
          if (disabledState !== null) {
            setIsButtonDisabled(disabledState === 'true');
          }
        });
        // Можно оставить состояние по умолчанию
        setIsButtonDisabled(false);
        setIsClaimButton(false);
      }
    });
  
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [userId]);
  

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
      if (response.data.points) {
        setPoints(response.data.points);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const startTimer = (duration) => {
    const endTime = Date.now() + duration * 1000;
    tg.CloudStorage.setItem('endTime', endTime, (error) => {
      if (error) {
        console.error('Ошибка при сохранении времени окончания:', error);
      }
    });

    // Обновляем состояние для отображения
    setIsButtonDisabled(true);
    setIsClaimButton(false);
    tg.CloudStorage.setItem('isButtonDisabled', 'true');
    tg.CloudStorage.setItem('isClaimButton', 'false');

    const interval = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(remainingTime);
      tg.CloudStorage.setItem('timeRemaining', remainingTime);
      if (remainingTime <= 0) {
        clearInterval(interval);
        tg.CloudStorage.removeItem('endTime');
        // Обновляем состояние после завершения таймера
        setIsButtonDisabled(false);
        setIsClaimButton(true);
        tg.CloudStorage.setItem('isButtonDisabled', 'false');
        tg.CloudStorage.setItem('isClaimButton', 'true');
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
    tg.CloudStorage.setItem('points', newPoints, (error) => {
      if (error) {
        console.error('Ошибка при сохранении очков:', error);
      }
    });
    saveUserData(userId, newPoints);
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
    tg.CloudStorage.setItem('isClaimButton', 'false', (error) => {
      if (error) {
        console.error('Ошибка при обновлении состояния кнопки:', error);
      }
    });
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
          {isClaimButton
            ? 'Claim 52.033 BTS'
            : isButtonDisabled
            ? formatTime(timeRemaining)
            : 'Mine 52.033 BTS'}
        </button>
      </div>
      <Menu />
    </section>
  );
}

export default HomePage;
