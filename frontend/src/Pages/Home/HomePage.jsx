import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram.WebApp;

function HomePage() {
    // Получаем очки из localStorage или устанавливаем 0.033
    const [points, setPoints] = useState(() => {
        const savedPoints = localStorage.getItem('points');
        return savedPoints ? parseFloat(savedPoints) : 0.033;
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(() => {
        const savedIsButtonDisabled = localStorage.getItem('isButtonDisabled');
        return savedIsButtonDisabled === 'true' ? true : false;
    });
    const [timeRemaining, setTimeRemaining] = useState(() => {
        const endTimeStr = localStorage.getItem('endTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            if (!isNaN(endTime)) { // Проверяем валидность числа
                const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
                return remaining;
            }
        }
        return 0;
    });
    const [isClaimButton, setIsClaimButton] = useState(() => {
        return localStorage.getItem('isClaimButton') === 'true' || false;
    });
    const timerIntervalRef = useRef(null); // Используем ref для хранения интервала

    const onPointsUpdate = useCallback((amount) => {
        setPoints(prev => prev + amount);
    }, []);

    useEffect(() => {
        // Загрузка таймера при монтировании компонента
        const endTimeStr = localStorage.getItem('endTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            if (!isNaN(endTime)) {
                const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
                setTimeRemaining(remaining);
                setIsButtonDisabled(remaining > 0);
                setIsClaimButton(remaining <= 0);

                if (remaining > 0) {
                    startTimer(remaining);
                } else {
                    localStorage.removeItem('endTime');
                    setIsButtonDisabled(false);
                    setIsClaimButton(true); // Кнопка Claim доступна, так как таймер истек
                    localStorage.setItem('isClaimButton', 'true');
                }
            }
        }

        // Cleanup function to clear the interval when the component unmounts
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null; // Reset the ref
            }
        };
    }, []);

    const startTimer = (duration) => {
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem('endTime', endTime.toString());
        setIsButtonDisabled(true);
        setIsClaimButton(false);
        localStorage.setItem('isClaimButton', 'false'); // Кнопка Claim недоступна, пока идет таймер
        timerIntervalRef.current = setInterval(() => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null; // Reset ref
                localStorage.removeItem('endTime');
                setIsButtonDisabled(false);
                setIsClaimButton(true); // Кнопка Claim становится доступной
                localStorage.setItem('isClaimButton', 'true');
                setTimeRemaining(0);
            }
        }, 1000);
    };

    const handleMineFor100 = () => {
        setIsButtonDisabled(true);
        setIsClaimButton(false); // Claim button is unavailable while mining
        localStorage.setItem('isButtonDisabled', 'true');
        localStorage.setItem('isClaimButton', 'false');
        const oneMinuteInSeconds = 60;
        setTimeRemaining(oneMinuteInSeconds);
        startTimer(oneMinuteInSeconds);
    };

    const updatePointsInDatabase = async (newPoints) => {
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';
        // Убедитесь, что у вас есть userId, который можно передать в функцию
        // const userId = ...; // Получите userId из Telegram WebApp или другого источника
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        if (!userId) {
            console.warn("User ID not found, cannot update points.");
            return; // Прекращаем выполнение, если userId отсутствует
        }

        try {
            const response = await fetch(UPDATE_POINTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegramId: userId,  // Используем userId
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

    const handleClaimPoints = async () => {
        const bonusPoints = 52.033;
        const newPoints = points + bonusPoints;
        try {
            await updatePointsInDatabase(newPoints);
            setPoints(newPoints);
            localStorage.setItem('points', newPoints);
            setIsClaimButton(false);
            localStorage.setItem('isClaimButton', 'false');
        } catch (error) {
            console.error("Failed to claim points:", error);
            // Handle errors, e.g., show a message to the user
        }
    };

    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <section className='bodyhomepage'>
            <span className='points-count'>{points.toFixed(4)}</span>
            <DayCheck onPointsUpdate={onPointsUpdate} />
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
                {isButtonDisabled && !isClaimButton && <Timer style={{ marginRight: '8px' }} />}
                {isClaimButton ? 'Claim 52.033 BTS' : (isButtonDisabled ? formatTime(timeRemaining) : 'Mine 52.033 BTS')}
            </button>
            <Menu />
        </section>
    );
}

export default HomePage;