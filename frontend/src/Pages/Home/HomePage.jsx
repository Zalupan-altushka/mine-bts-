import { useEffect, useState, useCallback, useRef } from 'react';
import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import Timer from '../../Most Used/Image/Timer';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';

const tg = window.Telegram.WebApp;

function HomePage({ userData }) {
    const [points, setPoints] = useState(0);
    const [isMining, setIsMining] = useState(() => {
        // Получаем состояние isMining из localStorage при инициализации
        const storedIsMining = localStorage.getItem('isMining');
        return storedIsMining === 'true' ? true : false;
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(() => {
        // Получаем состояние isButtonDisabled из localStorage
        const storedIsButtonDisabled = localStorage.getItem('isButtonDisabled');
        return storedIsButtonDisabled === 'true' ? true : false;
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
    const [timerInterval, setTimerInterval] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const timerRef = useRef(null);  // Добавили ref для setInterval

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

    const updatePointsInDatabase = async (telegramId, newPoints) => {
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';

        try {
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

            console.log("Очки успешно обновлены в базе данных!");

        } catch (error) {
            console.error("Ошибка при обновлении очков:", error);
            throw error; // Re-throw the error to be caught by the calling function
        }
    };

    const handleMineFor100 = () => {
        setIsMining(true);
        setIsButtonDisabled(true);
        localStorage.setItem('isMining', 'true');
        localStorage.setItem('isButtonDisabled', 'true');
        const oneMinuteInSeconds = 60;
        setTimeRemaining(oneMinuteInSeconds);
        startTimer(oneMinuteInSeconds);
    };

    const startTimer = (duration) => {
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem('endTime', endTime.toString());
        timerRef.current = setInterval(() => {  // Используем ref для setInterval
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(timerRef.current); // Используем ref для clearInterval
                localStorage.removeItem('endTime');
                setIsButtonDisabled(false);
                setIsMining(false);
                localStorage.setItem('isMining', 'false');
                localStorage.setItem('isButtonDisabled', 'false');
                setTimeRemaining(0);
                timerRef.current = null; // Reset the ref
            }
        }, 1000);
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
                setIsMining(false);
                setIsButtonDisabled(false);
                localStorage.setItem('isMining', 'false');
                localStorage.setItem('isButtonDisabled', 'false');
            })
            .catch(error => {
                console.error("Ошибка при обновлении очков:", error);
            });
    };

    useEffect(() => {
        // Загрузка таймера при инициализации HomePage
        const endTimeStr = localStorage.getItem('endTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            if (!isNaN(endTime)) {
                const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
                setTimeRemaining(remaining);
                setIsButtonDisabled(remaining > 0);
                setIsMining(remaining > 0);
                if (remaining > 0) {
                    startTimer(remaining);
                } else {
                    localStorage.removeItem('endTime');
                    setIsButtonDisabled(false);
                    setIsMining(false);
                    localStorage.setItem('isMining', 'false');
                    localStorage.setItem('isButtonDisabled', 'false');
                    setTimeRemaining(0);
                }
            } else {
                // Обработка ошибки, если endTime не является числом
                localStorage.removeItem('endTime');
                setIsButtonDisabled(false);
                setIsMining(false);
                localStorage.setItem('isMining', 'false');
                localStorage.setItem('isButtonDisabled', 'false');
                setTimeRemaining(0);
            }
        }
        // Clean up the interval on unmount or when dependencies change
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null; // Reset the ref
            }
        };
    }, []);

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
            <DayCheck
                onPointsUpdate={onPointsUpdate}
                userData={userData}
                updatePointsInDatabase={updatePointsInDatabase}
            />
            <Game />
            <BoosterContainer />
            <FriendsConnt />
            <button
                className='FarmButton'
                onClick={isMining ? handleClaimPoints : handleMineFor100}
                disabled={isButtonDisabled}
                style={{
                    backgroundColor: isMining ? '#c4f85c' : (isButtonDisabled ? '#c4f85c' : ''),
                    color: isMining ? 'black' : (isButtonDisabled ? 'black' : ''),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {isMining && <Timer style={{ marginRight: '8px' }} />}
                {isMining ? (
                    timeRemaining > 0 ? formatTime(timeRemaining) : 'Claim 52.033 BTS'
                ) : (
                    'Mine 52.033 BTS'
                )}
            </button>
            <Menu />
        </section>
    );
}

export default HomePage;