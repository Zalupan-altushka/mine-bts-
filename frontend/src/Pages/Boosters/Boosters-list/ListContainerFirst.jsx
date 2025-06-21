import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckIconBr from '../img-jsx-br/CheckIconBr';
import Tonlogo from '../img-jsx-br/Tonlogo';

function ListsContainerFirst({ isActive }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webApp, setWebApp] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false); // Initial state is false

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setWebApp(window.Telegram.WebApp);
        }
    }, []);

    useEffect(() => {
        // Function to fetch user data from auth.js
        const fetchUserData = async () => {
            try {
                // Get initData (assumed getTelegramInitData is available here)
                const initData = getTelegramInitData();
                const response = await axios.post('https://ah-user.netlify.app/.netlify/functions/auth', { initData });

                if (response.data) {
                    setUserData(response.data);
                      setIsPurchased(response.data?.ton_boost >= 1);
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Call fetchUserData on component mount
        fetchUserData();
    }, []);

   const boosterInfo = { // Прямой импорт
      ton_boost: {
        item_id: "ton_boost",
        title: "TON Booster",
        description: "Increase power by 0.072 BTS/hr",
        price: 1,
        currency: "XTR",
      }
    };

  const handleBuyClick = async () => {
    setIsLoading(true);

    if (!webApp) {
      setIsLoading(false);
      return;
    }

    try {
      const invoiceData = {
        title: boosterInfo.ton_boost.title, //ton_boost
        description: boosterInfo.ton_boost.description, //ton_boost
        payload: JSON.stringify({ item_id: boosterInfo.ton_boost.item_id, user_id: webApp.initDataUnsafe.user.id }), //ton_boost
        currency: boosterInfo.ton_boost.currency, //ton_boost
        prices: [{ amount: boosterInfo.ton_boost.price, label: boosterInfo.ton_boost.title }], //ton_boost
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
      setInvoiceLink(newInvoiceLink);

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

             if (verificationResponse.status === 200) {
                const data = verificationResponse.data;

                if (data.success) {
                     setUserData(response.data);
                      setIsPurchased(true);

                } else {
                  console.error("Payment verification failed:", data.error);
                  // Payment verification error handling
                }
              } else {
                console.error("Verification error:", verificationResponse.status);
                // HTTP error handling
              }

          } catch (verificationError) {
            console.error("Verification Error", verificationError);
          }

        } else if (status === "closed") {
            console.log("Invoice Closed");
        } else {
          console.log("Payment Failed or Canceled", status);
        }
      });

    } catch (error) {
      setIsLoading(false);
      console.error("Invoice Creation Error", error);
    }
  };

    useEffect(() => {
        // Update isPurchased when userData changes
        if (userData) {
            setIsPurchased(userData.ton_boost >= 1);
        }
    }, [userData]);

  let buttonContent = isPurchased ? <CheckIconBr /> : "0.7K"; // Use CheckIconBr

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button
              className={`ListButtonTon ${isPurchased ? 'purchased' : ''}`}
              onClick={handleBuyClick}
              disabled={!isActive || isLoading || !webApp || isPurchased}
            >
              {buttonContent}
            </button>
          </div>
          <section className='mid-section-list'>
            <Tonlogo />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-ton'>0.072 BTS/hr</span>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ListsContainerFirst;