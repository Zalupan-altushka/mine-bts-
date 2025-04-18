import React, { useEffect, useState, useRef } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

const tg = window.Telegram.WebApp;

function DayCheck({ onPointsUpdate }) {
  // Используем useRef для хранения состояния, чтобы оно сохранялось между рендерами
  const dayCheckCountRef = useRef(0);
  const timeLeftRef = useRef(0);
  const isButtonDisabledRef = useRef(false);
  const timerIntervalRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true); // Для отображения загрузки
  const [displayCount, setDisplayCount] = useState(0);
  const [displayTimeLeft, setDisplayTimeLeft] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    let isMounted = true;
  
    // Загружаем счетчик дней
    tg.CloudStorage.getItem('dayCheckCount', (error, storedCount) => {
      if (!error && storedCount !== null && isMounted) {
        const count = parseInt(storedCount, 10);
        dayCheckCountRef.current = count;
        setDisplayCount(count);
      }
    });
  
    // Загружаем время следующего сбора
    tg.CloudStorage.getItem('nextClaimTime', (error, storedTime) => {
      if (!error && storedTime && isMounted) {
        const storedTimestamp = parseInt(storedTime, 10);
        const remainingTime = storedTimestamp - Date.now();
        if (remainingTime > 0) {
          // Восстанавливаем таймер
          startTimer(remainingTime);
          isButtonDisabledRef.current = true;
          setIsButtonDisabled(true);
          setDisplayTimeLeft(remainingTime);
        } else {
          // Таймер истек, сбрасываем состояние
          tg.CloudStorage.removeItem('nextClaimTime');
          isButtonDisabledRef.current = false;
          setIsButtonDisabled(false);
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    });
  
    return () => {
      isMounted = false;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startTimer = (duration) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const endTime = Date.now() + duration;
    timeLeftRef.current = duration;
    setDisplayTimeLeft(duration);
    isButtonDisabledRef.current = true;
    setIsButtonDisabled(true);

    timerIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      timeLeftRef.current = remaining;
      setDisplayTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerIntervalRef.current);
        isButtonDisabledRef.current = false;
        setIsButtonDisabled(false);
      }
    }, 1000);
  };

  const handleGetButtonClick = () => {
    // Обновляем очки
    onPointsUpdate(30.033);
  
    // Блокируем кнопку
    setIsButtonDisabled(true);
    isButtonDisabledRef.current = true;
  
    // Устанавливаем время следующего сбора
    const nextClaimTime = Date.now() + 12 * 60 * 60 * 1000;
    tg.CloudStorage.setItem('nextClaimTime', nextClaimTime);
    localStorage.setItem('nextClaimTime', nextClaimTime.toString());
  
    // Обновляем счетчик дней
    const newCount = dayCheckCountRef.current + 1;
    dayCheckCountRef.current = newCount;
    setDisplayCount(newCount);
    localStorage.setItem('dayCheckCount', newCount.toString());
  
    // Устанавливаем время последнего сбора
    tg.CloudStorage.setItem('lastClaimTime', Date.now());
    localStorage.setItem('lastClaimTime', Date.now().toString());
  
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
    return null; // или индикатор загрузки
  }

  return (
    <div className='container-check-day'>
      <div className='left-section-gif'>
        <Moom />
      </div>
      <div className='mid-section-textabout'>
        <span className='first-span'>{displayCount} day-check</span>
        <span className='second-span'>
          {isButtonDisabled ? `Next claim in ${formatTimeLeft(displayTimeLeft)}` : 'Claim available!'}
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
