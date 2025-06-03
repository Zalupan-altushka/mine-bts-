import React, { useEffect, useState, useCallback, useRef } from 'react';
import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram.WebApp;

function HomePage() {
    const [points, setPoints] = useState(0);
    const [isMining, setIsMining] = useState(() => {
        const storedIsMining = localStorage.getItem('isMining') === 'true';
        return storedIsMining;
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(() => {
        return localStorage.getItem('isButtonDisabled') === 'true';
    });
    const [timeRemaining, setTimeRemaining] = useState(() => {
        const endTimeStr = localStorage.getItem('endTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            if (!isNaN(endTime)) {
                const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
                return remaining;
            }
        }
        return 0;
    });
    const [isClaimButton, setIsClaimButton] = useState(() => {
        return localStorage.getItem('isClaimButton') === 'true';
    });
    const [timerInterval, setTimerInterval] = useState(null);
    const [userData, setUserData] = useState(null);
    const timerRef = useRef(null);

    const onPointsUpdate = useCallback((amount) => {
        setPoints(prev => prev + amount);
    }, []);

    useEffect(() => {
        console.log('HomePage: useEffect triggered');
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        if (userId) {
            console.log('HomePage: User ID from Telegram WebApp:', userId);
            fetchUserData(userId);
        } else {
            console.warn("User ID not found in Telegram WebApp");
        }
    }, []);

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
                setPoints(Math.floor(data.userData.points || 0));
                localStorage.setItem('points', Math.floor(data.userData.points || 0).toString());
            } else {
                console.warn("Не удалось получить данные пользователя");
            }
        } catch (error) {
            console.error("Ошибка при запросе данных пользователя:", error);
        }
    };

    useEffect(() => {
        if (timeRemaining > 0) {
            startTimer(timeRemaining);
        }
    }, [timeRemaining]);

    const startTimer = (duration) => {
        clearInterval(timerRef.current);
        const endTime = Date.now() + duration * 1000;
        console.log("startTimer: endTime", endTime);
        localStorage.setItem('endTime', endTime.toString());
        localStorage.setItem('isButtonDisabled', 'true');
        setIsButtonDisabled(true);
        setIsMining(true);

        const interval = setInterval(() => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            console.log("startTimer: remainingTime", remainingTime);
            setTimeRemaining(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(interval);
                localStorage.removeItem('endTime');
                localStorage.setItem('isButtonDisabled', 'false');
                localStorage.setItem('isMining', 'false');
                localStorage.setItem('isClaimButton', 'true');

                setIsButtonDisabled(false);
                setIsMining(false);
                setIsClaimButton(true);
                setTimeRemaining(0); // Reset timeRemaining
            }
        }, 1000);
        timerRef.current = interval;
    };

    const handleMineFor100 = () => {
        const oneMinuteInSeconds = 60;
        setTimeRemaining(oneMinuteInSeconds);
        startTimer(oneMinuteInSeconds);
        setIsMining(true);
        localStorage.setItem('isMining', 'true');
        localStorage.setItem('isButtonDisabled', 'true');
        localStorage.setItem('isClaimButton', 'false');
        setIsButtonDisabled(true);
        setIsClaimButton(false);
    };

    const updatePointsInDatabase = async (newPoints) => {
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

        if (!userId) {
            console.warn("User ID not found, cannot update points.");
            return;
        }

        console.log("updatePointsInDatabase: telegramId", userId, "points:", newPoints);
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
            setPoints(Math.floor(newPoints));
            localStorage.setItem('points', Math.floor(newPoints).toString());
        } catch (error) {
            console.error("Ошибка при обновлении очков:", error);
        }
    };

    const handleClaimPoints = async () => {
        const bonusPoints = 100;
        const newPoints = points + bonusPoints;
        await updatePointsInDatabase(newPoints);
        setPoints(Math.floor(newPoints));
        localStorage.setItem('points', Math.floor(newPoints).toString());
        setIsClaimButton(false);
    };

    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <section className='bodyhomepage'>
            {userData && (
                <>
                    <span className='points-count'>{points}</span>
                    <DayCheck onPointsUpdate={updatePointsInDatabase} userData={userData} />
                    <Game />
                    <BoosterContainer />
                    <FriendsConnt />
                    <button
                        className='FarmButton'
                        onClick={isClaimButton ? handleClaimPoints : handleMineFor100}
                        disabled={isButtonDisabled && !isClaimButton}
                        style={{
                            backgroundColor: isClaimButton ? '#c4f85c' : (isButtonDisabled ? '#c4f85c' : ''),
                            color: isClaimButton ? 'black' : (isButtonDisabled ? 'black' : ''),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isButtonDisabled && isMining && <Timer style={{ marginRight: '8px' }} />}
                        {isClaimButton ? 'Claim 52.033 BTS' : (isButtonDisabled ? formatTime(timeRemaining) : 'Mine 52.033 BTS')}
                    </button>
                    <Menu />
                </>
            )}
        </section>
    );
}

export default HomePage;