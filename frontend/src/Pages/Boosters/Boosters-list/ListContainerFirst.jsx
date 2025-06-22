import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckIconBr from '../img-jsx-br/CheckIconBr';
import Tonlogo from '../img-jsx-br/Tonlogo';

function ListsContainerFirst({ isActive, userData }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webApp, setWebApp] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false); // Начальное состояние

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setWebApp(window.Telegram.WebApp);
    }
  }, []);

  // Initialize isPurchased from userData prop
  useEffect(() => {
    if (userData) {
      setIsPurchased(userData.ton_boost === true);
    }
  }, [userData]);

  const boosterInfo = {
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
        title: boosterInfo.ton_boost.title,
        description: boosterInfo.ton_boost.description,
        payload: JSON.stringify({ item_id: boosterInfo.ton_boost.item_id, user_id: webApp.initDataUnsafe.user.id }),
        currency: boosterInfo.ton_boost.currency,
        prices: [{ amount: boosterInfo.ton_boost.price, label: boosterInfo.ton_boost.title }],
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
                if (!data.duplicate && !data.alreadyOwned) {
                  // После успешной покупки обновляем состояние
                  setIsPurchased(true);
                } else if (data.duplicate) {
                  console.warn('Это дубликат платежа, не обновляем UI');
                } else if (data.alreadyOwned) {
                  console.warn('Бустер уже куплен, не обновляем UI');
                }
              } else {
                console.error("Payment verification failed:", data.error);
                // Handle payment verification failure
              }
            } else {
              console.error("Verification error:", verificationResponse.status);
              // Handle HTTP error
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

  let buttonContent = isPurchased ? <CheckIconBr /> : "0.7K";

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