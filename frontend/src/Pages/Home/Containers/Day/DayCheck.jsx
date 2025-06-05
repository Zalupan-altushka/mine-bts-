import React, { useEffect, useState, useRef } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

function DayCheck({ onPointsUpdate, userData }) { // Добавляем userData в пропсы
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dayCheckCount, setDayCheckCount] = useState(0); // Состояние для хранения количества day-check
  const [timerRunning, setTimerRunning] = useState(false); // Состояние для управления таймером
  const timerRef = useRef(null);

  const updatePointsInDatabase = async (newPoints) => {
    const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';
    const userId = userData?.telegram_user_id;

    if (!userId) {
      console.warn("User ID not found, cannot update points.");
      return;
    }

    try {
      const response = await fetch(UPDATE_POINTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: userId,
          points: newPoints.toFixed(3), // Округляем до 3 знаков после запятой
        }),
      });

      if (!response.ok) {
        console.error("HTTP error при обновлении очков:", response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        console.error("Ошибка от Netlify Function:", data.error);
        throw new Error(`Failed to update points in database: ${data.error}`);
      }

      console.log("Очки успешно обновлены в базе данных!");
    } catch (error) {
      console.error("Ошибка при обновлении очков:", error);
    }
  };

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
        setTimerRunning(true);
        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1000) {
              clearInterval(interval);
              setIsButtonDisabled(false);
              setTimerRunning(false);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, []);

  const handleGetButtonClick = async () => {
    const bonusPoints = 30.033; // Количество очков для добавления
    const newPoints = (userData?.points || 0) + bonusPoints;

    // Обновляем очки в базе данных
    await updatePointsInDatabase(newPoints);

    // Обновляем очки в родительском компоненте
    onPointsUpdate(newPoints);

    setIsButtonDisabled(true);
    setTimerRunning(true);
    const nextClaimTime = Date.now() + 60 * 1000; // 1 минута
    localStorage.setItem('nextClaimTime', nextClaimTime);
    setTimeLeft(60 * 1000); // Устанавливаем время блокировки

    // Увеличиваем количество day-check и сохраняем в localStorage
    const newDayCheckCount = dayCheckCount + 1;
    setDayCheckCount(newDayCheckCount);
    localStorage.setItem('dayCheckCount', newDayCheckCount);
    localStorage.setItem('lastClaimTime', Date.now()); // Сохраняем время последнего сбора

    // Запускаем таймер
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timerRef.current);
          setIsButtonDisabled(false);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const formatTimeLeft = (time) => {
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className='container-check-day'>
      <div className='left-section-gif'>
        <Moom />
      </div>
      <div className='mid-section-textabout'>
        <span className='first-span'>{dayCheckCount} day-check</span> {/* Обновляем количество day-check */}
        <span className='second-span'>
          {timerRunning ? `Next claim in ${formatTimeLeft(timeLeft)}` : 'Сlaim available!'}
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