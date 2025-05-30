import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect, useCallback } from 'react';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram.WebApp;

function HomePage({ userData }) {
    const [points, setPoints] = useState(0);
    const [isMining, setIsMining] = useState(false); // Состояние для отслеживания, идет ли майнинг
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const onPointsUpdate = useCallback((amount) => {
        setPoints(prev => prev + amount);
    }, []);

    useEffect(() => {
        console.log("HomePage: useEffect triggered");
        if (userData) {
            console.log("HomePage: userData received:", userData);
            if (userData.points !== undefined) {
                console.log("HomePage: userData.points:", userData.points);
                setPoints(userData.points);
                setIsLoading(false);
                setInitialLoadComplete(true);
            } else {
                console.warn("HomePage: userData.points is undefined");
                setIsLoading(false);
                setInitialLoadComplete(true);
            }
        } else {
            console.warn("HomePage: userData is null or undefined");
            setIsLoading(false);
            setInitialLoadComplete(true);
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
            setIsMining(remaining > 0); // Устанавливаем isMining в true, если таймер активен
            if (remaining > 0) {
                startTimer(remaining);
            } else {
                localStorage.removeItem('endTime');
                setIsMining(false); // Устанавливаем isMining в false, если таймер истек
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
                setIsMining(false); // Устанавливаем isMining в false, когда таймер истек
                setTimerInterval(null);
            }
        }, 1000);
        setTimerInterval(interval);
    };

    const handleMineFor100 = () => {
        setIsMining(true); // Начинаем майнинг
        setIsButtonDisabled(true);
        const sixHoursInSeconds = 6 * 60 * 60;
        setTimeRemaining(sixHoursInSeconds);
        startTimer(sixHoursInSeconds);
    };

    const updatePointsInDatabase = async (telegramId, newPoints) => {
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';

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
            console.error("HTTP error при обновлении очков:", response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
            console.error("Ошибка от Netlify Function:", data.error);
            throw new Error(`Failed to update points in database: ${data.error}`);
        }
    };

    const handleClaimPoints = () => {
        if (!userData || !userData.telegram_user_id) {
            console.warn("Нет данных пользователя для обновления очков.");
            return;
        }

        const bonusPoints = 52.033;
        const newPoints = points + bonusPoints;

        updatePointsInDatabase(userData.telegram_user_id, newPoints)
            .then(() => {
                setPoints(newPoints);
                setIsMining(false); // Заканчиваем майнинг после получения награды
                setIsButtonDisabled(false);
            })
            .catch(error => {
                console.error("Ошибка при обновлении очков:", error);
            });
    };

    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    if (!initialLoadComplete) {
        return <p>Loading...</p>;
    }

    return (
        <section className='bodyhomepage'>
            <span className='points-count'>{points.toFixed(4)}</span>
            <DayCheck onPointsUpdate={onPointsUpdate} userData={userData} />
            <Game />
            <BoosterContainer />
            <FriendsConnt />
            <button
                className='FarmButton'
                onClick={isMining ? handleClaimPoints : handleMineFor100} // Условный вызов функций
                disabled={isButtonDisabled} // Кнопка заблокирована во время майнинга
                style={{
                    backgroundColor: isMining ? '#c4f85c' : (isButtonDisabled ? '#c4f85c' : ''),
                    color: isMining ? 'black' : (isButtonDisabled ? 'black' : ''),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {isMining && <Timer style={{ marginRight: '8px' }} />} {/* Отображаем таймер во время майнинга */}
                {isMining ? ( // Если идет майнинг, показываем таймер или Claim
                    timeRemaining > 0 ? formatTime(timeRemaining) : 'Claim 52.033 BTS'
                ) : (
                    'Mine 52.033 BTS' // Иначе предлагаем начать майнинг
                )}
            </button>
            <Menu />
        </section>
    );
}

export default HomePage;