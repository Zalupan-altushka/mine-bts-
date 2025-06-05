import React, { useEffect, useState, useRef } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

function DayCheck({ userData }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Загружаем время следующего запроса из localStorage
    const storedTime = localStorage.getItem('nextClaimTime');
    if (storedTime) {
      const remainingTime = parseInt(storedTime, 10) - Date.now();
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setIsButtonDisabled(true);
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1000) {
              clearInterval(timerRef.current);
              setIsButtonDisabled(false);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
        return () => clearInterval(timerRef.current);
      }
    }
  }, []);

  const handleGetButtonClick = () => {
    setIsButtonDisabled(true);
    const nextClaimTime = Date.now() + 60 * 1000; // 1 минута
    localStorage.setItem('nextClaimTime', nextClaimTime);
    setTimeLeft(60 * 1000); // Устанавливаем время блокировки

    // Запускаем таймер
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timerRef.current);
          setIsButtonDisabled(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const formatTimeLeft = (time) => {
    const minutes = Math.floor((time / 1000) / 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className='container-check-day'>
      <div className='left-section-gif'>
        <Moom />
      </div>
      <div className='mid-section-textabout'>
        <span className='first-span'>Day-check</span>
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