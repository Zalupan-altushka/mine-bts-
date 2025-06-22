import React, { useState, useEffect } from 'react';
import './BoostersBox.css';
import StarBr from '../img-jsx-br/StarBr';
import axios from 'axios';

function BoostersBox({ userData, updateUserData }) {
    const [webApp, setWebApp] = useState(null); // Добавьте состояние для webApp
    const [pointsBalance, setPointsBalance] = useState(() => {
        // Read pointsBalance from local storage on component mount
        const storedBalance = localStorage.getItem('pointsBalance');
        return storedBalance ? parseFloat(storedBalance) : 0;
    });

    useEffect(() => {
        localStorage.setItem('pointsBalance', pointsBalance.toString());
    }, [pointsBalance]); // Update localStorage when pointsBalance changes

    const [storageFillPercentage, setStorageFillPercentage] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setWebApp(window.Telegram.WebApp); // Инициализируйте webApp
        }
    }, []);


    useEffect(() => {
        let totalBoostRatePerHour = 0; // Total boost rate per hour

        if (userData) {
            // Calculate total boost rate based on purchased boosters (per hour)
            if (userData.ton_boost === true) {
                totalBoostRatePerHour += 0.072;
            }
            if (userData.apps_boost === true) {
                totalBoostRatePerHour += 18.472;
            }
            if (userData.prem_boost === true) {
                totalBoostRatePerHour += 38.172;
            }
            if (userData.eth_boost === true) {
                totalBoostRatePerHour += 48.472;
            }
            if (userData.btc_boost === true) {
                totalBoostRatePerHour += 68.172;
            }
        }

        // Convert hourly rate to per-second rate
        const totalBoostRatePerSecond = totalBoostRatePerHour / 3600;

        // Function to update points balance
        const updatePointsBalance = () => {
            setPointsBalance(prevBalance => {
                let newBalance = prevBalance + totalBoostRatePerSecond;
                if (newBalance > 1000) {
                    newBalance = 1000;
                }
                return newBalance;
            });
        };

        // Set interval to update points balance every second
        const intervalId = setInterval(updatePointsBalance, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);

    }, [userData]);

    useEffect(() => {
        // Update storage fill percentage when pointsBalance changes
        setStorageFillPercentage(Math.min((pointsBalance / 1000) * 100, 100));
    }, [pointsBalance]);

    const handleClaimClick = async () => {
        setIsClaiming(true);

        try {
            // Prepare request body
            const requestBody = {
                telegramId: webApp?.initDataUnsafe?.user?.id,  // Use correct user ID
                pointsToAdd: pointsBalance, // Send the points to add
            };

            // Отправляем запрос к Netlify Function add-points
            const response = await fetch('/.netlify/functions/add-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to add points:', errorData);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
            }

            const responseData = await response.json();

            if (responseData.success) {
                // Claim successful, reset pointsBalance in local storage
                setPointsBalance(0);
                localStorage.setItem('pointsBalance', '0'); // Ensure localStorage is also updated
                console.log('Points added successfully');
                 if (updateUserData) {
                    await updateUserData();
                }
            } else {
                // Claim failed, handle error
                console.error('Failed to add points:', responseData.error);
            }
        } catch (error) {
            console.error('Error adding points:', error);
        } finally {
            setIsClaiming(false);
        }
    };

    const isClaimButtonDisabled = pointsBalance < 1000;

    return (
        <section className='boosters-box'>
            <article className='height-section-box'>
                <div className='left-section-box'>
                    <span className='first-span-box'>Boosters Market</span>
                    <span className='two-span'>Please buy boosters with TG Stars</span>
                </div>
                <div className='right-section-box'>
                    <StarBr />
                </div>
            </article>
            <div className='polosa' />
            <article className='middle-section-box'>
                <div className='center-section-middle'>
                    <div className="points-container">
                        <span className='points-balance'>{pointsBalance.toFixed(3)}</span>
                        <span className='storage-fill'>{storageFillPercentage.toFixed(0)}%</span>
                    </div>
                </div>
                <button
                  className={`Claim-button-br ${isClaimButtonDisabled ? 'disabled' : ''}`}
                  onClick={handleClaimClick}
                  disabled={isClaimButtonDisabled || isClaiming}
                >
                    {isClaiming ? 'Claiming...' : 'Claim'}
                </button>
            </article>
        </section>
    );
}

export default BoostersBox;