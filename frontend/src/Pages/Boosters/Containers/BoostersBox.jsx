import React, { useState, useEffect } from 'react';
import './BoostersBox.css';
import StarBr from '../img-jsx-br/StarBr';
import axios from 'axios';

function BoostersBox({ userData, updateUserData, isActive }) {
    const [webApp, setWebApp] = useState(null);
    const [pointsBalance, setPointsBalance] = useState(() => {
        const storedBalance = localStorage.getItem('pointsBalance');
        return storedBalance ? parseFloat(storedBalance) : 0;
    });

    useEffect(() => {
        localStorage.setItem('pointsBalance', pointsBalance.toString());
    }, [pointsBalance]);

    const [storageFillPercentage, setStorageFillPercentage] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setWebApp(window.Telegram.WebApp);
        }
    }, []);

    useEffect(() => {
        let totalBoostRatePerHour = 0;
        if (userData) {
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
        const totalBoostRatePerSecond = totalBoostRatePerHour / 3600;

        const calculatePointsSinceLastUpdate = () => {
            const lastUpdateTimestamp = localStorage.getItem('lastPointsUpdate');
            if (lastUpdateTimestamp) {
                const timePassed = Date.now() - parseFloat(lastUpdateTimestamp);
                const pointsToAdd = (timePassed / 1000) * totalBoostRatePerSecond;
                return pointsToAdd;
            }
            return 0;
        };

        const initialPointsToAdd = calculatePointsSinceLastUpdate();
        setPointsBalance(prevBalance => {
            let newBalance = prevBalance + initialPointsToAdd;
            if (newBalance > 1000) {
                newBalance = 1000;
            }
            return newBalance;
        });

        const updatePointsBalance = () => {
            setPointsBalance(prevBalance => {
                let newBalance = prevBalance + totalBoostRatePerSecond;
                if (newBalance > 1000) {
                    newBalance = 1000;
                }
                return newBalance;
            });
            localStorage.setItem('lastPointsUpdate', Date.now().toString());
        };

        localStorage.setItem('lastPointsUpdate', Date.now().toString());
        const intervalId = setInterval(updatePointsBalance, 1000);
        return () => clearInterval(intervalId);
    }, [userData]);

    useEffect(() => {
        setStorageFillPercentage(Math.min((pointsBalance / 1000) * 100, 100));
    }, [pointsBalance]);

    const handleClaimClick = async () => {
        setIsClaiming(true);

        try {
            const requestBody = {
                telegramId: webApp?.initDataUnsafe?.user?.id,
                pointsToAdd: pointsBalance,
            };

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
                setPointsBalance(0);
                localStorage.setItem('pointsBalance', '0');
                console.log('Points added successfully');
                if (updateUserData) {
                    await updateUserData();
                }
            } else {
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
                    <div className="balance-container">
                        <span className="balance-text">Balance:</span>
                        <span className='points-balance'>{pointsBalance.toFixed(3)}</span>
                    </div>
                    <div className="storage-container">
                        <span className="storage-text">Storage:</span>
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