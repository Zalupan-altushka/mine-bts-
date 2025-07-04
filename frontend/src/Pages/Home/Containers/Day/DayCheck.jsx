import React, { useEffect, useState } from 'react';
import './DayCheck.css';
import CheckIconDay from '../img-jsx/CheckIconDay';
import MoomDay from '../img-jsx/MoomDay';

function DayCheck({ userData, updateUserData }) {
    const [dayCheckCount, setDayCheckCount] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedDayCheckCount = localStorage.getItem('dayCheckCount');
        const lastClaimTime = localStorage.getItem('lastClaimTime');

        if (lastClaimTime) {
            const timeSinceLastClaim = Date.now() - parseInt(lastClaimTime, 10);
            if (timeSinceLastClaim > 24 * 60 * 60 * 1000) {
                setDayCheckCount(0);
                localStorage.setItem('dayCheckCount', 0);
            } else if (storedDayCheckCount) {
                setDayCheckCount(parseInt(storedDayCheckCount, 10));
            }
        } else {
            setDayCheckCount(0);
        }

        const storedEndTime = localStorage.getItem('dayCheckEndTime');
        if (storedEndTime) {
            const endTime = parseInt(storedEndTime, 10);
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime > 0) {
                setIsButtonDisabled(true);
                startTimer(remainingTime);
            }
        }
    }, []);

    const handleGetPoints = async () => {
        setIsLoading(true);
        const bonusPoints = 30.033;
        const newPoints = parseFloat(localStorage.getItem('points')) + bonusPoints;
        const updated = await updatePointsInDatabase(newPoints);
        if (updated) {
            localStorage.setItem('points', newPoints.toFixed(3).toString());
            setDayCheckCount(prevCount => prevCount + 1); // Update state using updater function
            localStorage.setItem('dayCheckCount', dayCheckCount + 1); // Store the OLD value
            localStorage.setItem('lastClaimTime', Date.now().toString());

            setIsButtonDisabled(true);
            const twelveHoursInSeconds = 12 * 60 * 60;
            setTimeRemaining(twelveHoursInSeconds);
            startTimer(twelveHoursInSeconds);
        }
        setIsLoading(false);
        if (updateUserData) {
            await updateUserData();
        }
    };

    const startTimer = (duration) => {
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem('dayCheckEndTime', endTime.toString());

        const timer = setInterval(() => {
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeRemaining(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(timer);
                localStorage.removeItem('dayCheckEndTime');
                setIsButtonDisabled(false);
                setTimeRemaining(0);
            }
        }, 1000);
    };

    const updatePointsInDatabase = async (newPoints) => {
        const UPDATE_POINTS_URL = 'https://ah-user.netlify.app/.netlify/functions/update-points';
        const userId = userData?.telegram_user_id;

        if (!userId) {
            console.warn("User ID not found, cannot update points.");
            return false;
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
            return true;
        } catch (error) {
            console.error("Ошибка при обновлении очков:", error);
            return false;
        }
    };

    const formatTimeDay = (seconds) => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className='container-check-day'>
            <div className='left-section-gif'>
                <MoomDay />
            </div>
            <div className='mid-section-textabout'>
                <span className='first-span'>{dayCheckCount} day-check</span>
                <span className='second-span'>
                    {isButtonDisabled ? `Next claim in ${formatTimeDay(timeRemaining)}` : 'Claim available!'}
                </span>
            </div>
            <div className='right-section-button'>
                <button
                    className={`Get-button ${isButtonDisabled ? 'disabled' : ''}`}
                    onClick={handleGetPoints}
                    disabled={isButtonDisabled || isLoading}
                >
                    {isLoading ? <span style={{ fontSize: '10px' }}>Wait...</span> : (isButtonDisabled ? <CheckIconDay /> : 'Get')}
                </button>
            </div>
        </div>
    );
}

export default DayCheck;