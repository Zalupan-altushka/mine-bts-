import React, { useEffect, useState } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

function DayCheck({ onPointsUpdate }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dayCheckCount, setDayCheckCount] = useState(0); // Состояние для хранения количества day-check

  useEffect(() => {
    // Загружаем количество day-check из localStorage
    const storedDayCheckCount = localStorage.getItem('dayCheckCount');
    const lastClaimTime = localStorage.getItem('lastClaimTime');

    // Проверяем, прошло ли 24 часа с последнего сбора
    if (lastClaimTime) {
      const timeSinceLastClaim = Date.now() - parseInt(lastClaimTime, 10);
      if (timeSinceLastClaim > 24 * 60 * 60 * 1000) {
        // Если прошло более 24 часов, обнуляем счетчик
        setDayCheckCount(0);
        localStorage.setItem('dayCheckCount', 0);
      } else if (storedDayCheckCount) {
        setDayCheckCount(parseInt(storedDayCheckCount, 10));
      }
    } else {
      setDayCheckCount(0); // Если значение не найдено, устанавливаем его в 0
    }

    // Загружаем время следующего запроса из localStorage
    const storedTime = localStorage.getItem('nextClaimTime');
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
  }, []);

  const handleGetButtonClick = () => {
    onPointsUpdate(30.033); // Обновляем очки
    setIsButtonDisabled(true);
    const nextClaimTime = Date.now() + 12 * 60 * 60 * 1000; // 12 часов
    localStorage.setItem('nextClaimTime', nextClaimTime);
    setTimeLeft(12 * 60 * 60 * 1000); // Устанавливаем время блокировки

    // Увеличиваем количество day-check и сохраняем в localStorage
    const newDayCheckCount = dayCheckCount + 1;
    setDayCheckCount(newDayCheckCount);
    localStorage.setItem('dayCheckCount', newDayCheckCount);
    localStorage.setItem('lastClaimTime', Date.now()); // Сохраняем время последнего сбора
  };

  const formatTimeLeft = (time) => {
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
        <span className='first-span'>{dayCheckCount} day-check</span> {/* Обновляем количество day-check */}
        <span className='second-span'>
          {isButtonDisabled ? `Next claim in ${formatTimeLeft(timeLeft)}` : 'Сlaim available!'}
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