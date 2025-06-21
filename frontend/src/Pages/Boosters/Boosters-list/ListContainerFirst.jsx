import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckIconBr from '../img-jsx-br/CheckIconBr';
import Tonlogo from '../img-jsx-br/Tonlogo';

function ListsContainerFirst({ isActive, userData }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webApp, setWebApp] = useState(null);
  const [isPurchased, setIsPurchased] = useState(userData?.ton_boost >= 1);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setWebApp(window.Telegram.WebApp);
    }
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

              if (verificationResponse.status === 200) { // Проверяем код ответа
                const data = verificationResponse.data;

                if (data.success) {
                  if (data.duplicate) {
                    console.log("Дубликат платежа, не списываем звезды");
                    // Здесь можно показать сообщение пользователю о том, что платеж уже был обработан
                  } else {
                    console.log("Оплата прошла успешно, обновляем UI");
                    setIsPurchased(true);
                  }
                } else {
                  console.error("Payment verification failed:", data.error);
                  // Обработка ошибки верификации
                }
              } else {
                console.error("Ошибка при верификации:", verificationResponse.status);
                // Обработка ошибки HTTP
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