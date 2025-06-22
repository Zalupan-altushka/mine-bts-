import React, { useState, useEffect } from 'react';
import './BoostersBox.css';
import StarBr from '../img-jsx-br/StarBr';
import axios from 'axios';

function BoostersBox({ userData }) {
    const [pointsBalance, setPointsBalance] = useState(0);
    const [storageFillPercentage, setStorageFillPercentage] = useState(0); // State for storage fill percentage
    const [isClaimButtonDisabled, setIsClaimButtonDisabled] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        let totalBoostRate = 0;

        if (userData) {
            // Calculate total boost rate based on purchased boosters
            if (userData.ton_boost === true) {
                totalBoostRate += 0.072;
            }
            if (userData.apps_boost === true) {
                totalBoostRate += 18.472;
            }
            if (userData.prem_boost === true) {
                totalBoostRate += 38.172;
            }
            if (userData.eth_boost === true) {
                totalBoostRate += 48.472;
            }
            if (userData.btc_boost === true) {
                totalBoostRate += 68.172;
            }
        }

        // Function to update points balance
        const updatePointsBalance = () => {
            setPointsBalance(prevBalance => {
                let newBalance = prevBalance + totalBoostRate;
                if (newBalance > 1000) {
                    newBalance = 1000;
                }
                return newBalance;
            });

            // Update storage fill percentage
            setStorageFillPercentage(Math.min((pointsBalance / 1000) * 100, 100));

        };

        // Set interval to update points balance every second
        const intervalId = setInterval(updatePointsBalance, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);

    }, [userData, pointsBalance]); // Depend on pointsBalance


    useEffect(() => {
        // Update storage fill percentage when pointsBalance changes
        setStorageFillPercentage(Math.min((pointsBalance / 1000) * 100, 100));
    }, [pointsBalance]);

    const handleClaimClick = async () => {
        setIsClaiming(true);
        setIsClaimButtonDisabled(true); // Disable the claim button immediately

        try {
            const response = await axios.post(
                'https://ah-user.netlify.app/.netlify/functions/update-points', // Замените URL
                { points: pointsBalance, userId: webApp.initDataUnsafe.user.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                setPointsBalance(0);
                setStorageFillPercentage(0);
                console.log('Points claimed successfully');
            } else {
                console.error('Failed to claim points:', response.data.error);
                // Handle error
            }
        } catch (error) {
            console.error('Error claiming points:', error);
            // Handle error
        } finally {
            setIsClaiming(false);
            setIsClaimButtonDisabled(false); // Re-enable the claim button after claiming
        }
    };



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
                    <div>
                        Balance:
                        <span className='points-balance'>{pointsBalance.toFixed(3)}</span>
                        <button className='info-button'>inf</button>
                    </div>
                    <div>
                        Storage:
                        <span className='green-background' style={{ width: `${storageFillPercentage}%` }}></span>
                        <span className='storage-fill'>{storageFillPercentage.toFixed(0)}%</span>
                    </div>
                </div>
                <button className='Claim-button-br' onClick={handleClaimClick} disabled={isClaimButtonDisabled || isClaiming}>
                    {isClaiming ? 'Claiming...' : 'Claim'}
                </button>

            </article>
        </section>
    );
}

export default BoostersBox;
