import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import GrHeart from '../../Most Used/Image/GrHeart';

const tg = window.Telegram.WebApp;

function HomePage() {
  const [points, setPoints] = useState(() => {
    const savedPoints = tg.deviceStorage.getItem('points');
    return savedPoints ? parseFloat(savedPoints) : 0.0333; // Initial points are 0.0333
  });
  const [userId, setUserId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const savedTime = tg.deviceStorage.getItem('timeRemaining');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [isClaimButton, setIsClaimButton] = useState(() => {
    const savedClaimButtonState = tg.deviceStorage.getItem('isClaimButton');
    return savedClaimButtonState === 'true'; // Convert string to boolean
  });
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    if (tg) {
      const user = tg.initDataUnsafe.user;
      if (user) {
        const id = user.id; // Get user ID from Telegram
        setUserId(id);
        saveUserData(id, points); // Save user data when userId is set
      }
    }

    // Restore timer state from end time if available
    const endTime = tg.deviceStorage.getItem('endTime');
    if (endTime) {
      const remainingTime = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
      setTimeRemaining(remainingTime);
      setIsButtonDisabled(remainingTime > 0);
      setIsClaimButton(remainingTime <= 0);
      if (remainingTime > 0) {
        startTimer(remainingTime);
      } else {
        tg.deviceStorage.removeItem('endTime'); // Clear end time if timer is done
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval); // Clear interval on component unmount
      }
    };
  }, []);

  const fetchUserPoints = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
      updatePoints(response.data.points); // Update points from the response
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const saveUserData = async (userId, points) => {
    if (!userId) return; // Prevent saving if userId is not available
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/user`, { userId, points });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const startTimer = (duration) => {
    const endTime = Date.now() + duration * 1000;
    tg.deviceStorage.setItem('endTime', endTime); // Save end time to device storage

    const interval = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(remainingTime);
      tg.deviceStorage.setItem('timeRemaining', remainingTime); // Save remaining time to device storage
      setIsButtonDisabled(remainingTime > 0);
      const claimButtonState = remainingTime <= 0;
      setIsClaimButton(claimButtonState);
      tg.deviceStorage.setItem('isClaimButton', claimButtonState); // Save claim button state to device storage

      if (remainingTime <= 0) {
        clearInterval(interval);
        tg.deviceStorage.removeItem('endTime'); // Clear end time when timer is done
      }
    }, 1000);
    setTimerInterval(interval); // Save interval ID to clear it later
  };

  const handlePointsUpdate = (amount) => {
    const newPoints = points + amount;
    updatePoints(newPoints);
  };

  const updatePoints = (newPoints) => {
    setPoints(newPoints);
    tg.deviceStorage.setItem('points', newPoints); // Save points to device storage
    saveUserData(userId, newPoints); // Save updated points
  };

  const handleMineFor100 = () => {
    setIsButtonDisabled(true);
    const sixHoursInSeconds = 6 * 60 * 60; // 6 hours in seconds
    setTimeRemaining(sixHoursInSeconds);
    startTimer(sixHoursInSeconds);
  };

  const handleClaimPoints = () => {
    const newPoints = points + 52.033;
    updatePoints(newPoints);
    setIsClaimButton(false);
    tg.deviceStorage.setItem('isClaimButton', false); // Update device storage
  };

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <section className='bodyhomepage'>
      <div className='margin-div'></div>
      <div className='for-margin-home'></div>
      <span className='points-count'>{points.toFixed(4)}</span>
      <DayCheck onPointsUpdate={handlePointsUpdate} />
      <div className='container-game'>
        <div className='left-section-gif-game'>
          <GrHeart />
        </div>
        <div className='mid-section-textabout-game'>
          <span className='first-span-game'>Mini Game</span> 
          <span className='second-span-game'>
            <span>Coming soon...</span>
          </span>
        </div>
        <div className='right-section-button-game'>
          <button className='Game-button'>?</button>
        </div>
      </div>
      <BoosterContainer />
      <FriendsConnt />
      <div className='ButtonGroup'>
        <button
          className='FarmButton'
          onClick={isClaimButton ? handleClaimPoints : handleMineFor100}
          disabled={isButtonDisabled && !isClaimButton}
          style={{
            backgroundColor: isClaimButton ? 'white' : (isButtonDisabled ? '#c4f85c' : ''),
            color: isClaimButton ? 'black' : (isButtonDisabled ? 'black' : ''),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isButtonDisabled && !isClaimButton && <Timer style={{ marginRight: '8px' }} />}
          {isClaimButton ? 'Claim 52.033 BTS' : (isButtonDisabled ? formatTime(timeRemaining) : 'Mine 52.033 BTS')}
        </button>
      </div>
      <Menu />
    </section>
  );
}

export default HomePage;
