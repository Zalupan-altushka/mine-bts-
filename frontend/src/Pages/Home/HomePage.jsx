import './Home.css';
import Menu from '../../Most Used/Menu/Menu';
import { useState, useEffect } from 'react';
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
    const [isButtonDisabled, setIsButtonDisabled] = useState(() => {
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
    const [isClaimButton, setIsClaimButton] = useState(() => {
        const storedIsClaimButton = localStorage.getItem('isClaimButton');
        return storedIsClaimButton === 'true' ? true : false;
    });
    const [timerInterval, setTimerInterval] = useState(null);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
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
            console.warn('HomePage: User ID not found in Telegram WebApp');
            setInitialLoadComplete(true);
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
                body: JSON.stringify({
                    telegramId: userId,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.userData) {
                console.log('HomePage: User data fetched successfully:', data.userData);
                setUserData(data.userData);
                setPoints(data.userData.points || 0);
                localStorage.setItem('points', data.userData.points || 0);
                setInitialLoadComplete(true);
            } else {
                console.warn('HomePage: User data is missing in response');
                setInitialLoadComplete(true);
            }
        } catch (error) {
            console.error('HomePage: Error fetching user data:', error);
            setInitialLoadComplete(true);
        }
    };

    const updatePointsInDatabase = async (newPoints) => {
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

        if (!userId) {
            console.warn('User ID not found, cannot update points.');
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
                console.error('HTTP error при обновлении очков:', response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.success) {
                console.error('Ошибка от Netlify Function:', data.error);
                throw new Error(`Failed to update points in database: ${data.error}`);
            }
            console.log('Очки успешно обновлены в базе данных!');
            setPoints(newPoints);
            localStorage.setItem('points', newPoints.toString());

        } catch (error) {
            console.error('Ошибка при обновлении очков:', error);
        }
    };

    const handleMineFor100 = () => {
        setIsMining(true);
        setIsButtonDisabled(true);
        setIsClaimButton(false); // Кнопка Claim теперь недоступна
        localStorage.setItem('isMining', 'true');
        localStorage.setItem('isButtonDisabled', 'true');
        localStorage.setItem('isClaimButton', 'false'); // Сохраняем состояние Claim Button
        const oneMinuteInSeconds = 60;
        setTimeRemaining(oneMinuteInSeconds);
        startTimer(oneMinuteInSeconds);
    };

    const startTimer = (duration) => {
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem('endTime', endTime.toString());
        setIsButtonDisabled(true);
        localStorage.setItem('isButtonDisabled', 'true');
        timerRef.current = setInterval(() => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(timerRef.current);
                localStorage.removeItem('endTime');
                setIsButtonDisabled(false);
                setIsMining(false);
                setIsClaimButton(true); // Кнопка Claim теперь доступна
                localStorage.setItem('isMining', 'false');
                localStorage.setItem('isButtonDisabled', 'false');
                localStorage.setItem('isClaimButton', 'true'); // Сохраняем состояние Claim Button
                setTimeRemaining(0);
                setTimerInterval(null);
            }
        }, 1000);
    };

    const handleClaimPoints = () => {
        const bonusPoints = 52.033;
        const newPoints = points + bonusPoints;

        updatePointsInDatabase(newPoints)
            .then(() => {
                setPoints(newPoints);
                localStorage.setItem('points', newPoints.toString());

                setIsMining(false);
                setIsButtonDisabled(false);
                setIsClaimButton(false); // Кнопка Claim теперь недоступна после клейма
                localStorage.setItem('isMining', 'false');
                localStorage.setItem('isButtonDisabled', 'false');
                localStorage.setItem('isClaimButton', 'false'); // Сохраняем состояние Claim Button
            })
            .catch((error) => {
                console.error('Ошибка при обновлении очков:', error);
            });
    };

    useEffect(() => {
        const endTimeStr = localStorage.getItem('endTime');
        if (endTimeStr) {
            const endTime = parseInt(endTimeStr, 10);
            if (!isNaN(endTime)) {
                const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
                setTimeRemaining(remaining);
                setIsButtonDisabled(remaining > 0);
                setIsMining(remaining > 0);
                setIsClaimButton(remaining <= 0); // Правильно инициализируем isClaimButton

                if (remaining > 0) {
                    startTimer(remaining);
                } else {
                    localStorage.removeItem('endTime');
                    setIsButtonDisabled(false);
                    setIsMining(false);
                    setIsClaimButton(true);
                    localStorage.setItem('isMining', 'false');
                    localStorage.setItem('isButtonDisabled', 'false');
                    localStorage.setItem('isClaimButton', 'true');
                    setTimeRemaining(0);
                }
            }
        }
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
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
            <span className='points-count'>{Number(points).toFixed(4)}</span>
            <DayCheck
                onPointsUpdate={onPointsUpdate}
                updatePointsInDatabase={updatePointsInDatabase}
                userData={userData}
            />
            <Game />
            <BoosterContainer />
            <FriendsConnt />
            <button
                className='FarmButton'
                onClick={isClaimButton ? handleClaimPoints : handleMineFor100}
                disabled={isButtonDisabled} // Теперь используем только isButtonDisabled
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