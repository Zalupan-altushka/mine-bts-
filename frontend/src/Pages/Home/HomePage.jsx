import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import DayCheck from './Containers/Day/DayCheck';
import BoosterContainer from './Containers/BoostersCon/BoosterContainer';
import FriendsConnt from './Containers/FriendsCon/FriendsConnt';
import Game from './Containers/MiniGame/Game';
import Menu from '../Menus/Menu/Menu';
import TimerHm from './Containers/img-jsx/Timer';

const tg = window.Telegram.WebApp;

function HomePage({ userData, updateUserData }) {
    const [points, setPoints] = useState(() => {
        const storedPoints = localStorage.getItem('points');
        return storedPoints ? parseFloat(storedPoints) : 0;
    });
    const [isMining, setIsMining] = useState(() => {
        const storedIsMining = localStorage.getItem('isMining') === 'true';
        return storedIsMining === 'true';
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(() => {
        const storedIsButtonDisabled = localStorage.getItem('isButtonDisabled') === 'true';
        return storedIsButtonDisabled === 'true';
    });
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isClaimButton, setIsClaimButton] = useState(() => {
        const storedIsClaimButton = localStorage.getItem('isClaimButton');
        return storedIsClaimButton === 'true';
    });
    const [isLoading, setIsLoading] = useState(false);
    const timerRef = useRef(null);

    const handleClaimPoints = async () => {
        setIsLoading(true);
        const bonusPoints = 52.033;
        const newPoints = points + bonusPoints;
        await updatePointsInDatabase(newPoints);
        setPoints(parseFloat(newPoints.toFixed(3)));
        localStorage.setItem('points', newPoints.toFixed(3));
        setIsClaimButton(false);
        localStorage.setItem('isClaimButton', 'false');
        setIsButtonDisabled(false);
        localStorage.setItem('isButtonDisabled', 'false');
        setIsMining(false);
        localStorage.setItem('isMining', 'false');
        setIsLoading(false);
        if (updateUserData) {
            await updateUserData();
        }
    };

    const handleMineFor100 = () => {
        setIsLoading(true);
        const oneMinutesInSeconds = 1 * 60;
        setTimeRemaining(oneMinutesInSeconds);
        startTimer(oneMinutesInSeconds);
        setIsMining(true);
        localStorage.setItem('isMining', 'true');
        setIsButtonDisabled(true);
        localStorage.setItem('isButtonDisabled', 'true');
        setIsClaimButton(false);
        localStorage.setItem('isClaimButton', 'false');
        setIsLoading(false);
    };

    const startTimer = (duration) => {
        clearInterval(timerRef.current);
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem('homePageEndTime', endTime.toString());

        timerRef.current = setInterval(() => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(timerRef.current);
                localStorage.removeItem('homePageEndTime');
                setIsButtonDisabled(false);
                localStorage.setItem('isButtonDisabled', 'false');
                setIsMining(false);
                localStorage.setItem('isMining', 'false');
                setIsClaimButton(true);
                localStorage.setItem('isClaimButton', 'true');
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
             if (updateUserData) {
            await updateUserData();
        }
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
        const storedIsMining = localStorage.getItem('isMining');
        const storedIsButtonDisabled = localStorage.getItem('isButtonDisabled');
        const storedIsClaimButton = localStorage.getItem('isClaimButton');
        const storedEndTime = localStorage.getItem('homePageEndTime');

        setIsMining(storedIsMining === 'true');
        setIsButtonDisabled(storedIsButtonDisabled === 'true');
        setIsClaimButton(storedIsClaimButton === 'true');

        if (storedEndTime && storedIsButtonDisabled === 'true') {
            const endTime = parseInt(storedEndTime, 10);
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime > 0) {
                startTimer(remainingTime);
            } else {
                setIsClaimButton(true);
                localStorage.setItem('isClaimButton', 'true');
                setIsButtonDisabled(false);
                localStorage.setItem('isButtonDisabled', 'false');
                setIsMining(false);
                localStorage.setItem('isMining', 'false');
                setTimeRemaining(0);
            }
        } else {
            setIsClaimButton(storedIsClaimButton === 'true');
            setIsButtonDisabled(storedIsButtonDisabled === 'true');
            setIsMining(storedIsMining === 'true');
        }
    }, []);

    useEffect(() => {
        if (userData) {
            const initialPoints = parseFloat(userData.points || 0);
            setPoints(initialPoints);
            localStorage.setItem('points', initialPoints.toString());
        }
    }, [userData]);

    useEffect(() => {
        localStorage.setItem('isMining', isMining.toString());
        localStorage.setItem('isButtonDisabled', isButtonDisabled.toString());
        localStorage.setItem('isClaimButton', isClaimButton.toString());
    }, [isMining, isButtonDisabled, isClaimButton]);

    return (
        <section className='bodyhomepage'>
            <span className='points-count'>{points.toFixed(3)}</span>
            <DayCheck onPointsUpdate={updatePointsInDatabase} userData={userData} updateUserData={updateUserData} />
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
                        {isButtonDisabled && isMining && <TimerHm style={{ marginRight: '9px' }} />}
                        {isClaimButton ? 'Claim 52.033 BTS' : (isButtonDisabled ? formatTime(timeRemaining) : 'Mine 52.033 BTS')}
                    </>
                )}
            </button>
          <Menu />
        </section>
    );
}

export default HomePage;