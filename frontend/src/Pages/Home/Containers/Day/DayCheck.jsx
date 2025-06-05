import React, { useEffect, useState } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

function DayCheck({ onPointsUpdate, userData }) { // Получаем функцию onPointsUpdate из пропсов
  const [dayCheckCount, setDayCheckCount] = useState(0);
  const [buttonStatus, setButtonStatus] = useState('Get');

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
          points: newPoints.toFixed(3),
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
      return true; // Возвращаем true при успешном обновлении
    } catch (error) {
      console.error("Ошибка при обновлении очков:", error);
      return false; // Возвращаем false при ошибке
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
  }, []);

  const handleGetButtonClick = async () => {
    setButtonStatus('Wait');

    const bonusPoints = 30.033;
    const newPoints = (userData?.points || 0) + bonusPoints;

    console.log("Current points:", userData?.points);
    console.log("New points:", newPoints);

    const success = await updatePointsInDatabase(newPoints);

    if (success) {
      onPointsUpdate(newPoints); // Вызываем функцию обновления очков из пропсов

      const newDayCheckCount = dayCheckCount + 1;
      setDayCheckCount(newDayCheckCount);
      localStorage.setItem('dayCheckCount', newDayCheckCount);
      localStorage.setItem('lastClaimTime', Date.now());
    }

    setButtonStatus('Get');
  };

  return (
    <div className='container-check-day'>
      <div className='left-section-gif'>
        <Moom />
      </div>
      <div className='mid-section-textabout'>
        <span className='first-span'>{dayCheckCount} day-check</span>
        <span className='second-span'>Claim available!</span>
      </div>
      <div className='right-section-button'>
        <button
          className='Get-button'
          onClick={handleGetButtonClick}
        >
          {buttonStatus === 'Wait' ? (
            <span style={{ fontSize: '12px' }}>Wait</span>
          ) : (
            'Get'
          )}
        </button>
      </div>
    </div>
  );
}

export default DayCheck;