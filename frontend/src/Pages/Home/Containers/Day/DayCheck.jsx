import React, { useEffect, useState } from 'react';
import './DayCheck.css';
import Moom from '../../../../Most Used/Image/Moom';
import CheckIcon from '../../../../Most Used/Image/CheckIcon';

function DayCheck({ updatePointsInDatabase, userData }) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(() => {
        const storedTime = localStorage.getItem('nextClaimTime');
        return storedTime ? parseInt(storedTime, 10) > Date.now() : false;
    });
    const [timeLeft, setTimeLeft] = useState(0);
    const [dayCheckCount, setDayCheckCount] = useState(() => {
        return parseInt(localStorage.getItem('dayCheckCount') || '0', 10);
    });

    useEffect(() => {
        if (!userData) {
            setIsButtonDisabled(true);
            return;
        }

        const storedTime = localStorage.getItem('nextClaimTime');
        if (storedTime) {
            const remainingTime = parseInt(storedTime, 10) - Date.now();
            if (remainingTime > 0) {
                setTimeLeft(remainingTime);
                setIsButtonDisabled(true);
                const interval = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1000) {
                            clearInterval(interval);
                            setIsButtonDisabled(false);
                            return 0;
                        }
                        return prev - 1000;
                    });
                }, 1000);
                return () => clearInterval(interval);
            } else {
                localStorage.removeItem('nextClaimTime');
                setIsButtonDisabled(false);
                setTimeLeft(0);
            }
        } else {
            setIsButtonDisabled(false);
        }
    }, [userData]);

    const handleGetButtonClick = async () => {
        if (!userData || !userData.telegram_id) {
            console.warn("Нет данных пользователя для обновления очков.");
            return;
        }

        setIsButtonDisabled(true);
        const oneMinuteInMilliseconds = 60 * 1000;
        const nextClaimTime = Date.now() + oneMinuteInMilliseconds;
        localStorage.setItem('nextClaimTime', nextClaimTime.toString());
        setTimeLeft(oneMinuteInMilliseconds);

        const newDayCheckCount = dayCheckCount + 1;
        setDayCheckCount(newDayCheckCount);
        localStorage.setItem('dayCheckCount', newDayCheckCount.toString());
        localStorage.setItem('lastClaimTime', Date.now().toString());

        try {
            const bonusPoints = 30;
            const newPoints = (userData.points || 0) + bonusPoints;
            await updatePointsInDatabase(newPoints);
        } catch (error) {
            console.error("Ошибка при обновлении очков в базе данных:", error);
        }
    };

    const formatTimeLeft = (time) => {
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    return (
        <div className='container-check-day'>
            <div className='left-section-gif'>
                <Moom />
            </div>
            <div className='mid-section-textabout'>
                <span className='first-span'>{dayCheckCount} day-check</span>
                <span className='second-span'>
                    {isButtonDisabled ? `Next claim in ${formatTimeLeft(timeLeft)}` : 'Claim available!'}
                </span>
            </div>
            <div className='right-section-button'>
                <button
                    className={`Get-button ${isButtonDisabled ? 'disabled' : ''}`}
                    onClick={handleGetButtonClick}
                    disabled={isButtonDisabled}
                >
                    {isButtonDisabled ? <CheckIcon /> : 'Get'}
                </button>
            </div>
        </div>
    );
}

export default DayCheck;