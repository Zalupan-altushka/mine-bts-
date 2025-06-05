import React, { useEffect, useState } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';

function DayCheck({ userData, onPointsUpdate }) {
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
  }, []);

  const handleGetPoints = async () => {
    const bonusPoints = 30.033;
    const newPoints = parseFloat(localStorage.getItem('points')) + bonusPoints;
    await updatePointsInDatabase(newPoints);
    onPointsUpdate(newPoints);
    localStorage.setItem('points', newPoints.toFixed(3).toString());
    setDayCheckCount(dayCheckCount + 1);
    localStorage.setItem('dayCheckCount', dayCheckCount + 1);
    localStorage.setItem('lastClaimTime', Date.now().toString());
  };

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
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении очков:", error);
      return false;
    }
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
        <button className='Get-button' onClick={handleGetPoints}>
          GeT
        </button>
      </div>
    </div>
  );
}

export default DayCheck;