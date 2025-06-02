import React, { useEffect, useState, useCallback } from 'react';
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
        const storedIsMining = localStorage.getItem('isMining');
        return storedIsMining === 'true' ? true : false;
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isClaimButton, setIsClaimButton] = useState(true);
    const [timerInterval, setTimerInterval] = useState(null);
    const [userData, setUserData] = useState(null);
    // Убрали isLoading

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
            //setIsLoading(false); // Убрали setIsloading
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
                //setIsLoading(false); //  При ошибке также убираем loader
                return;
            }

            const data = await response.json();
            if (data.isValid && data.userData) {
                setUserData(data.userData); // Сохраняем данные пользователя
                setPoints(data.userData.points || 0); // Устанавливаем начальное значение очков
                localStorage.setItem('points', (data.userData.points || 0).toString());
            } else {
                console.warn("Не удалось получить данные пользователя");
            }
        } catch (error) {
            console.error("Ошибка при запросе данных пользователя:", error);
        } finally {
            //setIsLoading(false); // Убираем loader в любом случае (успех или ошибка)
        }
    };

    const startTimer = (duration) => {
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem('endTime', endTime.toString());
        setIsButtonDisabled(true);
        localStorage.setItem('isButtonDisabled', 'true');
        timerRef.current = setInterval(() => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime === 0) {
                clearInterval(timerRef.current);
                localStorage.removeItem('endTime');
                setIsButtonDisabled(false);
                setIsMining(false);
                setIsClaimButton(true);
            }
        }, 1000);
        setTimerInterval(interval);
    };

    const handleMineFor100 = () => {
        setIsMining(true);
        setIsButtonDisabled(true);
        setIsClaimButton(false);
        localStorage.setItem('isMining', 'true');
        localStorage.setItem('isButtonDisabled', 'true');
        localStorage.setItem('isClaimButton', 'false');
        const oneMinuteInSeconds = 60; //Таймер изменен на 1 минуту
        setTimeRemaining(oneMinuteInSeconds);
        startTimer(oneMinuteInSeconds);
    };

    const updatePointsInDatabase = async (newPoints) => {
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

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
            // Обновляем состояние и localStorage только после успешного обновления в БД
            setPoints(newPoints);
            localStorage.setItem('points', newPoints.toString());
        } catch (error) {
            console.error("Ошибка при обновлении очков:", error);
        }
    };

    const handleClaimPoints = async () => {
        const bonusPoints = 100; // Изменено: 100 очков
        const newPoints = parseFloat(points) + bonusPoints;

        // Отправляем очки в базу данных
        await updatePointsInDatabase(newPoints);

        // Обновляем состояние и localStorage
        setPoints(newPoints);
        localStorage.setItem('points', newPoints.toString());
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
            <span className='points-count'>{points.toFixed(4)}</span>
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
        </section>
    );
}

export default HomePage;