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
        return storedPoints ? parseFloat(storedPoints) : 0;
    });
    const [isMining, setIsMining] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isClaimButton, setIsClaimButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
                const initialPoints = parseFloat(data.userData.points || 0);
                setPoints(initialPoints);
                localStorage.setItem('points', initialPoints.toFixed(3).toString());
            } else {
                console.warn("Не удалось получить данные пользователя");
            }
        } catch (error) {
            console.error("Ошибка при запросе данных пользователя:", error);
        }
    };

    const handleClaimPoints = async () => {
        setIsLoading(true);
        const bonusPoints = 52.033;
        const newPoints = points + bonusPoints;
        await updatePointsInDatabase(newPoints);
        setPoints(parseFloat(newPoints.toFixed(3)));
        localStorage.setItem('points', newPoints.toFixed(3).toString());
        setIsClaimButton(false);
        setIsButtonDisabled(false);
        setIsLoading(false);
    };

    const handleMineFor100 = () => {
        setIsLoading(true);
        const sixHoursInSeconds = 6 * 60 * 60;
        setTimeRemaining(sixHoursInSeconds);
        startTimer(sixHoursInSeconds);
        setIsMining(true);
        setIsButtonDisabled(true);
        setIsClaimButton(false);
        setIsLoading(false);
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

    const formatTime = (seconds) => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    };

    useEffect(() => {
        const storedPoints = localStorage.getItem('points');
        if (storedPoints) {
            setPoints(parseFloat(storedPoints));
        }

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
            } else {
                setIsClaimButton(true);
                setIsButtonDisabled(false);
                setIsMining(false);
            }
        } else {
            setIsClaimButton(false);
            setIsButtonDisabled(false);
        }
    }, []);

    useEffect(() => {
        if (userData) {
            setPoints(parseFloat(userData.points || 0));
            localStorage.setItem('points', (parseFloat(userData.points || 0)).toFixed(3).toString());
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
            <span className='points-count'>{points.toFixed(3)}</span>
            <DayCheck onPointsUpdate={setPoints} userData={userData} />
            <Game />
            <BoosterContainer />
            <FriendsConnt />
            <button
                className='FarmButton'
                onClick={isClaimButton ? handleClaimPoints : handleMineFor100}
                disabled={isButtonDisabled || isLoading}
                style={{
                    backgroundColor: isClaimButton ? '#c4f85c' : (isButtonDisabled ? '#c4f85c' : ''),
                    color: isClaimButton ? 'black' : (isButtonDisabled ? 'black' : ''),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {isLoading ? (
                    <span className="loading-indicator">Loading...</span>
                ) : (
                    <>
                        {isButtonDisabled && isMining && <Timer style={{ marginRight: '8px' }} />}
                        {isClaimButton ? 'Claim 52.033 BTS' : (isButtonDisabled ? formatTime(timeRemaining) : 'Mine 52.033 BTS')}
                    </>
                )}
            </button>
            <Menu />
        </section>
    );
}

export default HomePage;