import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram.WebApp;

function HomePage({ userData }) {
    const [points, setPoints] = useState(() => {
        const storedPoints = localStorage.getItem('points');
        return storedPoints ? parseInt(storedPoints, 10) : 0;
    });
    const [isMining, setIsMining] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isClaimButton, setIsClaimButton] = useState(true);
    const timerRef = useRef(null);

    const fetchUserData = async (userId) => {
        const AUTH_FUNCTION_URL = 'https://ah-user.netlify.app/.netlify/functions/auth';
        try {
            const response = await fetch(AUTH_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initData: window.Telegram?.WebApp?.initData }),
            });

            if (!response.ok) {
                console.error("Ошибка при получении данных пользователя:", response.status);
                return;
            }

            const data = await response.json();
            if (data.isValid && data.userData) {
                setUserData(data.userData);
                const initialPoints = Math.floor(data.userData.points || 0);
                setPoints(initialPoints);
                localStorage.setItem('points', initialPoints.toString()); // Сохраняем очки в LocalStorage
            } else {
                console.warn("Не удалось получить данные пользователя");
            }
        } catch (error) {
            console.error("Ошибка при запросе данных пользователя:", error);
        }
    };

    const handleClaimPoints = async () => {
        const bonusPoints = 50; // Изменено количество очков
        const newPoints = points + bonusPoints;
        await updatePointsInDatabase(newPoints);
        setPoints(Math.floor(newPoints));
        localStorage.setItem('points', Math.floor(newPoints).toString());
        setIsClaimButton(false);
    };

    const handleMineFor100 = () => {
        const sixHoursInSeconds = 60; // 1 минута для тестирования
        setTimeRemaining(sixHoursInSeconds);
        startTimer(sixHoursInSeconds);
        setIsMining(true);
        localStorage.setItem('isMining', 'true');
        setIsButtonDisabled(true);
        localStorage.setItem('isButtonDisabled', 'true');
        setIsClaimButton(false); // Disable Claim button when mining
    };

    const startTimer = (duration) => {
        clearInterval(timerRef.current);
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem('endTime', endTime.toString());

        timerRef.current = setInterval(() => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(timerRef.current);
                localStorage.removeItem('endTime');
                localStorage.setItem('isButtonDisabled', 'false');
                localStorage.setItem('isMining', 'false');
                localStorage.setItem('isClaimButton', 'true');

                // Обновляем состояния после завершения таймера
                setIsButtonDisabled(false);
                setIsMining(false);
                setIsClaimButton(true);
                setTimeRemaining(0);
            }
        }, 1000);
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
                    points: newPoints,
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

    const formatTime = (seconds) => {
      const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${secs}`;
    };

    useEffect(() => {
        // Загрузка начального состояния из localStorage
        const storedIsMining = localStorage.getItem('isMining') === 'true';
        const storedIsButtonDisabled = localStorage.getItem('isButtonDisabled') === 'true';
        const storedIsClaimButton = localStorage.getItem('isClaimButton') === 'true';
        const storedEndTime = localStorage.getItem('endTime');

        setIsMining(storedIsMining);
        setIsButtonDisabled(storedIsButtonDisabled);
        setIsClaimButton(storedIsClaimButton);

        if (storedEndTime && storedIsButtonDisabled) {
            const endTime = parseInt(storedEndTime, 10);
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime > 0) {
                startTimer(remainingTime);
            }
        }
    }, []);

    useEffect(() => {
        if (userData) {
            const initialPoints = userData.points || 0;
            setPoints(initialPoints);
            localStorage.setItem('points', initialPoints.toString());
        }
    }, [userData]);

    useEffect(() => {
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        if (userId) {
            fetchUserData(userId);
        }
    }, []);

    return (
        <section className='bodyhomepage'>
            <span className='points-count'>{points}</span>
            <DayCheck onPointsUpdate={updatePointsInDatabase} userData={userData} />
            <Game />
            <BoosterContainer />
            <FriendsConnt />
            <button
                className='FarmButton'
                onClick={isClaimButton ? handleClaimPoints : handleMineFor100}
                disabled={isButtonDisabled}
                style={{
                    backgroundColor: isClaimButton ? '#c4f85c' : (isButtonDisabled ? '#c4f85c' : ''),
                    color: isClaimButton ? 'black' : (isButtonDisabled ? 'black' : ''),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {isButtonDisabled && isMining && <Timer style={{ marginRight: '8px' }} />}
                {isClaimButton ? 'Claim 50 BTS' : (isButtonDisabled ? formatTime(timeRemaining) : 'Mine 50 BTS')}
            </button>
            <Menu />
        </section>
    );
}

export default HomePage;