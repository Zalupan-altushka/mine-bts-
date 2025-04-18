import React, { useEffect, useState, useRef } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

const tg = window.Telegram.WebApp;

function DayCheck({ onPointsUpdate }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dayCheckCount, setDayCheckCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Для отслеживания загрузки данных

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // Получаем текущий счетчик дней
      tg.CloudStorage.getItem('dayCheckCount', (error, storedCount) => {
        if (!error && storedCount !== null && isMounted) {
          setDayCheckCount(parseInt(storedCount, 10));
        }
      });

      // Получаем время следующего запроса
      tg.CloudStorage.getItem('nextClaimTime', (error, storedTime) => {
        if (!error && storedTime && isMounted) {
          const remainingTime = parseInt(storedTime, 10) - Date.now();
          if (remainingTime > 0) {
            setTimeLeft(remainingTime);
            setIsButtonDisabled(true);
            startTimer(remainingTime);
          }
        }
        if (isMounted) {
          setIsLoading(false);
        }
      });
    };

    loadData();

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Функция для запуска таймера
  const startTimer = (duration) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const endTime = Date.now() + duration;
    setTimeLeft(duration);
    setIsButtonDisabled(true);

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setIsButtonDisabled(false);
      }
    }, 1000);
  };

  const handleGetButtonClick = () => {
    // Обновляем очки
    onPointsUpdate(30.033);

    // Блокируем кнопку
    setIsButtonDisabled(true);

    // Устанавливаем время следующего сбора (12 часов)
    const nextClaimTime = Date.now() + 12 * 60 * 60 * 1000;
    tg.CloudStorage.setItem('nextClaimTime', nextClaimTime);

    // Обновляем счетчик дней
    const newCount = dayCheckCount + 1;
    setDayCheckCount(newCount);
    tg.CloudStorage.setItem('dayCheckCount', newCount);

    // Устанавливаем время последнего сбора
    tg.CloudStorage.setItem('lastClaimTime', Date.now());

    // Запускаем таймер
    startTimer(12 * 60 * 60 * 1000);
  };

  const formatTimeLeft = (time) => {
    const totalSeconds = Math.ceil(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  if (isLoading) {
    // Можно показывать загрузку или ничего не отображать
    return null;
  }

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


