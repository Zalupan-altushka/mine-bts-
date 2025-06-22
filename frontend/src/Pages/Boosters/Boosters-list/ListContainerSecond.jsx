import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PremiumTG from '../img-jsx-br/PremiumTG';
import TGcenter from '../img-jsx-br/TGcenter';
import CheckIconBr from '../img-jsx-br/CheckIconBr';

function ListsContainerSecond({ isActive, userData, updateUserData }) {
    const [isLoadingApps, setIsLoadingApps] = useState(false);
    const [isLoadingPrem, setIsLoadingPrem] = useState(false);
    const [isPurchasedApps, setIsPurchasedApps] = useState(false);
    const [isPurchasedPrem, setIsPurchasedPrem] = useState(false);
    const [webApp, setWebApp] = useState(null);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setWebApp(window.Telegram.WebApp);
        }
    }, []);

    useEffect(() => {
        if (userData) {
            setIsPurchasedApps(userData.apps_boost === true);
            setIsPurchasedPrem(userData.prem_boost === true);
        }
    }, [userData]);

    const handleBuyClick = async (itemType) => {
        let setIsLoading, setIsPurchased, title, description, prices, item_id;

        if (itemType === "apps") {
            setIsLoading = setIsLoadingApps;
            setIsPurchased = setIsPurchasedApps;
            title = "Apps Booster";
            description = "Increase power by 18.472 BTS/hr";
            prices = [{ amount: 1, label: "Apps Boost" }];
            item_id = "apps_boost";
        } else if (itemType === "prem") {
            setIsLoading = setIsLoadingPrem;
            setIsPurchased = setIsPurchasedPrem;
            title = "Prem Booster";
            description = "Increase power by 38.172 BTS/hr";
            prices = [{ amount: 1, label: "Prem Boost" }];
            item_id = "prem_boost";
        } else {
            console.error("Invalid itemType:", itemType);
            return;
        }

        setIsLoading(true);

        try {
            const invoiceData = {
                title: title,
                description: description,
                payload: JSON.stringify({ item_id: item_id, user_id: webApp.initDataUnsafe.user.id }),
                currency: "XTR",
                prices: prices,
            };

            const response = await axios.post(
                'https://ah-user.netlify.app/.netlify/functions/create-invoice',
                invoiceData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const { invoiceLink: newInvoiceLink } = response.data;

            webApp.openInvoice(newInvoiceLink, async (status) => {
                setIsLoading(false);

                if (status === "paid") {
                    try {
                        const verificationResponse = await axios.post(
                            'https://ah-user.netlify.app/.netlify/functions/verify-payment',
                            {
                                payload: invoiceData.payload,
                                user_id: webApp.initDataUnsafe.user.id
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        );

                        if (verificationResponse.data.success) {
                            if (!verificationResponse.data.duplicate && !verificationResponse.data.alreadyOwned) {
                                if (itemType === "apps") {
                                    setIsPurchasedApps(true);
                                } else if (itemType === "prem") {
                                    setIsPurchasedPrem(true);
                                }

                                // Call updateUserData here to refresh userData
                                if (updateUserData) {
                                    await updateUserData();
                                }
                            } else if (verificationResponse.data.duplicate) {
                                console.warn('Это дубликат платежа, не обновляем UI');
                            } else if (verificationResponse.data.alreadyOwned) {
                                console.warn('Бустер уже куплен, не обновляем UI');
                            }
                        } else {
                            console.error("Payment verification failed:", verificationResponse.data.error);
                        }
                    } catch (verificationError) {
                        console.error("Error verifying payment:", verificationError);
                    }
                } else {
                    console.log("Payment failed or canceled:", status);
                }
            });
        } catch (error) {
            console.error("Error creating or opening invoice:", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonContent = (itemType) => {
        if (itemType === "apps") {
            return isPurchasedApps ? <CheckIconBr /> : "0.3K";
        } else if (itemType === "prem") {
            return isPurchasedPrem ? <CheckIconBr /> : "0.5k";
        }
        return null;
    };

    const getButtonClassName = (itemType) => {
        let className = "";
        if (itemType === "apps") {
            className = "ListButtonCenter";
            if (isLoadingApps) className += " loading";
            if (isPurchasedApps) className += " purchased";
        } else if (itemType === "prem") {
            className = "ListButtonPrm";
            if (isLoadingPrem) className += " loading";
            if (isPurchasedPrem) className += " purchased";
        }
        return className;
    };

    return (
        <section className='lists-container'>
            <article className='boosters-list-center'>
                <div className='list'>
                    <div className='hight-section-list'>
                        <span>Apps</span>
                        <button
                            className={getButtonClassName("apps")}
                            onClick={() => handleBuyClick("apps")}
                            disabled={!isActive || isLoadingApps || isPurchasedApps || !webApp}
                        >
                            {getButtonContent("apps")}
                        </button>
                    </div>
                    <section className='mid-section-list'>
                        <TGcenter />
                    </section>
                    <div className='footer-section-list'>
                        <span className='text-power'>Power</span>
                        <span className='text-power-hr-center'>18.472 BTS/hr</span>
                    </div>
                </div>
            </article>
            <article className='boosters-list-prm'>
                <div className='list'>
                    <div className='hight-section-list'>
                        <span>Prem</span>
                        <button
                            className={getButtonClassName("prem")}
                            onClick={() => handleBuyClick("prem")}
                            disabled={!isActive || isLoadingPrem || isPurchasedPrem || !webApp}
                        >
                            {getButtonContent("prem")}
                        </button>
                    </div>
                    <section className='mid-section-list'>
                        <PremiumTG />
                    </section>
                    <div className='footer-section-list'>
                        <span className='text-power'>Power</span>
                        <span className='text-power-hr-bts'>38.172 BTS/hr</span>
                    </div>
                </div>
            </article>
        </section>
    );
}

export default ListsContainerSecond;