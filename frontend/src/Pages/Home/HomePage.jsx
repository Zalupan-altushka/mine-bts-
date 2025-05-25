import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect } from 'react';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram.WebApp;

function HomePage({ userData }) { // Принимаем userData как пропс
    const [points, setPoints] = useState(0); // Инициализируем начальное значение
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isClaimButton, setIsClaimButton] = useState(true);
    const [timerInterval, setTimerInterval] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Добавлено состояние для отслеживания начальной загрузки

    useEffect(() => {
        console.log("HomePage: useEffect triggered"); // Log when useEffect is triggered
        if (userData) {
            console.log("HomePage: userData received:", userData); // Добавлено логирование
            if (userData.points !== undefined) {
                console.log("HomePage: userData.points:", userData.points); // Log the points
                setPoints(userData.points);
                setIsLoading(false);
                setInitialLoadComplete(true); // Устанавливаем, что начальная загрузка завершена
            } else {
                console.warn("HomePage: userData.points is undefined");
                setIsLoading(false);
                setInitialLoadComplete(true); // Устанавливаем, что начальная загрузка завершена, даже если нет очков
            }
        } else {
            console.warn("HomePage: userData is null or undefined");
            setIsLoading(false);
            setInitialLoadComplete(true); // Устанавливаем, что начальная загрузка завершена, даже если нет userData
        }
    }, [userData]);


    // Загрузка таймера
    useEffect(() => {
        const endTimeStr = localStorage.getItem('endTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remaining);
            setIsButtonDisabled(remaining > 0);
            setIsClaimButton(remaining <= 0);
            if (remaining > 0) {
                startTimer(remaining);
            } else {
                localStorage.removeItem('endTime');
            }
        }
    }, []);

    const startTimer = (duration) => {
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem('endTime', endTime);
        const interval = setInterval(() => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime === 0) {
                clearInterval(interval);
                localStorage.removeItem('endTime');
                setIsButtonDisabled(false);
                setIsClaimButton(true);
            }
        }, 1000);
        setTimerInterval(interval);
    };

    const handleMineFor100 = async () => {
        setIsButtonDisabled(true);
        const sixHoursInSeconds = 6 * 60 * 60;
        setTimeRemaining(sixHoursInSeconds);
        startTimer(sixHoursInSeconds);

        // Обновляем очки в базе данных
        try {
            const newPoints = 52.033;  // Или какое-то другое фиксированное значение
            await updatePointsInDatabase(userData.telegram_id, newPoints);
            setPoints(newPoints);  // Обновляем локальный стейт
        } catch (error) {
            console.error("Ошибка при обновлении очков в базе данных:", error);
            // Обработка ошибки, например, показ уведомления пользователю
        }
    };

    const updatePointsInDatabase = async (telegramId, newPoints) => {
        // Замените URL на адрес вашей Netlify Function, которая обновляет очки в базе данных
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points'; //  ВАЖНО: Укажите правильный URL

        const response = await fetch(UPDATE_POINTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegramId: telegramId,
                points: newPoints,
            }),
        });

        if (!response.ok) {
            console.error("HTTP error при обновлении очков:", response.status, response.statusText); // Логируем детали ошибки
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
            console.error("Ошибка от Netlify Function:", data.error); // Логируем ошибку от функции
            throw new Error(`Failed to update points in database: ${data.error}`);
        }
    };


    const handleClaimPoints = () => {
        if (!userData) {
            console.warn("Нет данных пользователя для обновления очков.");
            return;
        }

        const bonusPoints = 52.033;
        const newPoints = points + bonusPoints;

        updatePointsInDatabase(userData.telegram_id, newPoints) // Pass telegramId
            .then(() => {
                setPoints(newPoints);
                setIsClaimButton(false);
            })
            .catch(error => {
                console.error("Ошибка при обновлении очков:", error);
                // Добавьте здесь логику обработки ошибок, например, отображение уведомления пользователю
            });
    };

    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    if (!initialLoadComplete) {
        return <p>Loading...</p>; // Отображаем загрузку, пока не завершится начальная загрузка
    }

    return (
        <section className='bodyhomepage'>
            <span className='points-count'>{points.toFixed(4)}</span>
            <DayCheck onPointsUpdate={(amount) => setPoints(prev => prev + amount)} />
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