import React, { useEffect, useState } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

function DayCheck({ onPointsUpdate, userData }) { // Получаем userData как пропс
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dayCheckCount, setDayCheckCount] = useState(0);

  useEffect(() => {
    const storedDayCheckCount = localStorage.getItem('dayCheckCount');
    const lastClaimTime = localStorage.getItem('lastClaimTime');

    if (lastClaimTime) {
      const timeSinceLastClaim = Date.now() - parseInt(lastClaimTime, 10);
      if (timeSinceLastClaim > 24 * 60 * 60 * 1000) {
        setDayCheckCount(0);
        localStorage.setItem('dayCheckCount', 0);
      } else if (storedDayCheckCount) {
        setDayCheckCount(parseInt(storedDayCheckCount, 10));
      }
    } else {
      setDayCheckCount(0);
    }

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
  }, [userData]); // Добавляем userData в зависимости

  const updatePointsInDatabase = async (telegramId, newPoints) => {
    const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points'; //  ВАЖНО: Укажите правильный URL

    const response = await fetch(UPDATE_POINTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            telegramId: telegramId,
            points: newPoints,
        }),
    });

    if (!response.ok) {
        console.error("HTTP error при обновлении очков:", response.status, response.statusText); // Логируем детали ошибки
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
        console.error("Ошибка от Netlify Function:", data.error); // Логируем ошибку от функции
        throw new Error(`Failed to update points in database: ${data.error}`);
    }
};

  const handleGetButtonClick = async () => {
    if (!userData) {
      console.warn("Нет данных пользователя для обновления очков.");
      return;
    }

    setIsButtonDisabled(true);
    const nextClaimTime = Date.now() + 12 * 60 * 60 * 1000;
    localStorage.setItem('nextClaimTime', nextClaimTime);
    setTimeLeft(12 * 60 * 60 * 1000);

    const newDayCheckCount = dayCheckCount + 1;
    setDayCheckCount(newDayCheckCount);
    localStorage.setItem('dayCheckCount', newDayCheckCount);
    localStorage.setItem('lastClaimTime', Date.now());

    // Обновляем очки в базе данных
    try {
      const newPoints = 30.033;
      await updatePointsInDatabase(userData.telegram_user_id, newPoints + userData.points);
      onPointsUpdate(30.033); // Обновляем очки в HomePage
    } catch (error) {
      console.error("Ошибка при обновлении очков в базе данных:", error);
      // Обработка ошибки, например, показ уведомления пользователю
    }
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
        <span className='first-span'>{dayCheckCount} day-check</span>
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