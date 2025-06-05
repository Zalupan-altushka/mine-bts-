import React, { useEffect, useState } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';

function DayCheck({ userData }) {
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
        <button className='Get-button'>
          GeT
        </button>
      </div>
    </div>
  );
}

export default DayCheck;