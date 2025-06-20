import React, { useState, useEffect } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';

function ListsContainerFirst({ isActive }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      setWebApp(window.Telegram.WebApp);
    }
  }, []);

  const handleBuyClick = async () => {
    setIsLoading(true);
    setError(null);

    if (!webApp) {
      setError("Telegram WebApp не инициализирован");
      setIsLoading(false);
      return;
    }

    try {
      const invoiceData = {
        title: "TON Booster",
        description: "Increase power by 0.072 BTS/hr",
        payload: JSON.stringify({ item_id: "ton_boost", user_id: webApp.initDataUnsafe.user.id }), // Добавляем user_id
        currency: "XTR",
        prices: [{ amount: 1, label: "TON Boost" }],
      };

      console.log("invoiceData:", invoiceData);

      const response = await axios.post(
        '/.netlify/functions/create-invoice', // Обновленный URL - УБРАЛИ АДРЕС СЕТИ
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
          console.log("Payment successful!");

          // Верификация платежа на сервере
          try {
            const verificationResponse = await axios.post(
              '/.netlify/functions/verify-payment', //  URL для верификации
              {
                payload: invoiceData.payload, // Отправляем payload для идентификации покупки
                user_id: webApp.initDataUnsafe.user.id // Отправляем ID пользователя
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (verificationResponse.data.success) {
              console.log("Payment verified successfully!");
              // TODO:  Обработка успешной верификации (выдача товара, обновление БД)
            } else {
              console.error("Payment verification failed:", verificationResponse.data.error);
              setError("Payment verification failed. Please contact support.");
            }
          } catch (verificationError) {
            console.error("Error verifying payment:", verificationError);
            setError("Error verifying payment. Please contact support.");
          }


        } else {
          console.log("Payment failed or canceled:", status);
          setError(`Payment failed or canceled: ${status}`);
        }

      });

    } catch (error) {
      console.error("Error creating or opening invoice:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button
              className='ListButtonTon'
              onClick={handleBuyClick}
              disabled={!isActive || isLoading || !webApp}
            >
              {isLoading ? "Loading..." : "0.7K"}
            </button>
          </div>
          <section className='mid-section-list'>
            <TON />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>More actions
            <span className='text-power-hr-ton'>0.072 BTS/hr</span>
          </div>
          {error && <div className="error-message">{error}</div>}
        </article>
      </div>
    </section>
  );
}

export default ListsContainerFirst;