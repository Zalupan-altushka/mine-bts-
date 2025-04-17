import React, { useEffect, useState } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

const tg = window.Telegram.WebApp;

function DayCheck({ onPointsUpdate }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dayCheckCount, setDayCheckCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedDayCheckCount = await tg.CloudStorage.getItem('dayCheckCount');
        const lastClaimTime = await tg.CloudStorage.getItem('lastClaimTime');

        // Логирование значений
        console.log('Stored dayCheckCount:', storedDayCheckCount);
        console.log('Last claim time:', lastClaimTime);

        // Убедитесь, что storedDayCheckCount - это число
        const dayCheckCountValue = storedDayCheckCount ? parseInt(storedDayCheckCount, 10) : 0;
        setDayCheckCount(dayCheckCountValue);

        if (lastClaimTime) {
          const timeSinceLastClaim = Date.now() - parseInt(lastClaimTime, 10);
          if (timeSinceLastClaim > 24 * 60 * 60 * 1000) {
            setDayCheckCount(0);
            await tg.CloudStorage.setItem('dayCheckCount', 0);
          }
        }

        const storedTime = await tg.CloudStorage.getItem('nextClaimTime');
        if (storedTime) {
          const remainingTime = parseInt(storedTime, 10) - Date.now();
          if (remainingTime > 0) {
            setTimeLeft(remainingTime);
            setIsButtonDisabled(true);
            const interval = setInterval(() => {
              setTimeLeft((prev) => {
                if (prev <= 1000) {
                  clearInterval(interval);
                  setIsButtonDisabled(false);
                  return 0;
                }
                return prev - 1000;
              });
            }, 1000);
            return () => clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    loadData();
  }, []);

  const handleGetButtonClick = async () => {
    try {
      // Обновляем очки
      onPointsUpdate(30.033);
      setIsButtonDisabled(true);
      const nextClaimTime = Date.now() + 12 * 60 * 60 * 1000;
      await tg.CloudStorage.setItem('nextClaimTime', nextClaimTime);
      setTimeLeft(12 * 60 * 60 * 1000);

      // Обновляем счетчик
      setDayCheckCount((prevCount) => {
        const newDayCheckCount = prevCount + 1;
        tg.CloudStorage.setItem('dayCheckCount', newDayCheckCount);
        tg.CloudStorage.setItem('lastClaimTime', Date.now());
        console.log('Updated dayCheckCount:', newDayCheckCount);
        return newDayCheckCount;
      });
    } catch (error) {
      console.error('Ошибка при нажатии кнопки:', error);
    }
  };

  const formatTimeLeft = (time) => {
    if (isNaN(time) || time < 0) return '00:00';
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <div className='container-check-day'>
      <div className='left-section-gif'>
        <Moom />
      </div>
      <div className='mid-section-textabout'>
        <span className='first-span'>{dayCheckCount} day-check</span>
        <span className='second-span'>
          {isButtonDisabled ? `Next claim in ${formatTimeLeft(timeLeft)}` : 'Claim available!'}
        </span>
      </div>
      <div className='right-section-button'>
        <button
          className={`Get-button ${isButtonDisabled ? 'disabled' : ''}`}
          onClick={handleGetButtonClick}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? <CheckIcon /> : 'Get'}
        </button>
      </div>
    </div>
  );
}

export default DayCheck;