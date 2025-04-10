import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';

const tg = window.Telegram.WebApp;

const UserProfile = ({ userId }) => {
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  useEffect(() => {
    if (tg) {
      const user = tg.initDataUnsafe.user;
      if (user) {
        const name = user.first_name || '';
        const photo = user.photo_url || '';

        setUserName(name);
        setUserPhoto(photo);

        // Save user data to MongoDB on profile load
        saveUserData(userId, 0.0333); // Initial points are 0.0333
      }
    }
  }, [userId]);

  const saveUserData = async (userId, points) => {
    if (!userId) return; // Prevent saving if userId is not available
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/user`, { userId, points });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <div className="user-profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#000000', width: '340px', height: '45px', borderRadius: '25px', padding: '0 10px' }}>
      {userPhoto ? (
        <img
          src={userPhoto}
          alt="User Avatar"
          style={{ width: '25px', height: '25px', borderRadius: '50%', marginRight: '10px' }}
        />
      ) : (
        <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#ccc', marginRight: '10px' }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {userName ? <h2 className='UserNameTG' style={{ margin: 0 }}>{userName}</h2> : <h2 style={{ margin: 0 }}>Loading...</h2>}
      </div>
    </div>
  );
};

function HomePage() {
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseFloat(savedPoints) : 0.0333; // Initial points are 0.0333
  });
  const [userId, setUserId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const savedTime = localStorage.getItem('timeRemaining');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [isClaimButton, setIsClaimButton] = useState(false);
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
    const endTime = localStorage.getItem('endTime');
    if (endTime) {
      const remainingTime = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
      setTimeRemaining(remainingTime);
      setIsButtonDisabled(remainingTime > 0);
      setIsClaimButton(remainingTime <= 0);
      if (remainingTime > 0) {
        startTimer(remainingTime);
      } else {
        localStorage.removeItem('endTime'); // Clear end time if timer is done
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval); // Clear interval on component unmount
      }
    };
  }, []);

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
    localStorage.setItem('endTime', endTime); // Save end time to local storage

    const interval = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(remainingTime);
      localStorage.setItem('timeRemaining', remainingTime); // Save remaining time to local storage
      setIsButtonDisabled(remainingTime > 0);
      setIsClaimButton(remainingTime <= 0);
      if (remainingTime <= 0) {
        clearInterval(interval);
        localStorage.removeItem('endTime'); // Clear end time when timer is done
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
    localStorage.setItem('points', newPoints); // Save points to local storage
    saveUserData(userId, newPoints); // Save updated points
  };

  const handleMineFor100 = () => {
    setIsButtonDisabled(true);
    const sixHoursInSeconds = 6 * 60 * 60;
    setTimeRemaining(sixHoursInSeconds);
    startTimer(sixHoursInSeconds);
  };

  const handleClaimPoints = () => {
    const newPoints = points + 52.033;
    updatePoints(newPoints);
    setIsClaimButton(false);
  };

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <section className='bodyhomepage'>
      <div className='UserContainer'>
        <UserProfile userId={userId} />
      </div>
      <span className='points-count'>{points.toFixed(4)}</span>
      <DayCheck onPointsUpdate={handlePointsUpdate} />
      <BoosterContainer />
      <FriendsConnt />
      <div className='ButtonGroup'>
        <button
          className='FarmButton'
          onClick={isClaimButton ? handleClaimPoints : handleMineFor100}
          disabled={isButtonDisabled && !isClaimButton}
          style={{
            backgroundColor: isClaimButton ? 'white' : (isButtonDisabled ? '#0f0f0f' : ''),
            color: isClaimButton ? 'black' : (isButtonDisabled ? '#b9bbbc' : ''),
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
