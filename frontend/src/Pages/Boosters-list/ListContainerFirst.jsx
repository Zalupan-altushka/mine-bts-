import React, { useState, useEffect } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';

function ListsContainerFirst({ isActive }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Эффект для инициализации Telegram Web App
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  const handleBuyClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const invoiceData = {
        title: "TON Booster",
        description: "Увеличение мощности на 0.072 BTS/час",
        payload: JSON.stringify({ item_id: "ton_boost" }),
        currency: "XTR",
        prices: [{ amount: 1, label: "TON Boost" }], // 700 = 0.7K звезд (цена в наименьших единицах XTR)
      };

      console.log("invoiceData:", invoiceData);

      const response = await axios.post(
        'https://ah-user.netlify.app/.netlify/functions/create-invoice',  // Замените на URL вашей Netlify Function
        invoiceData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { invoiceLink: newInvoiceLink } = response.data;
      setInvoiceLink(newInvoiceLink);

      window.Telegram.WebApp.openInvoice(newInvoiceLink, async (status) => {
        setIsLoading(false); // Перемещено сюда для гарантированного запуска

        if (status === "paid") {
          console.log("Оплата успешна!");
          try {
            // Отправка на бэкенд
            const purchaseResult = await axios.post('https://ah-user.netlify.app/.netlify/functions/process', { // Замените на ваш фактический эндпоинт
              item_id: "ton_boost",
              user_id: window.Telegram.WebApp.initDataUnsafe.user.id, // Или как вы идентифицируете пользователя
              invoice_link: newInvoiceLink,
              status: status
            });

            if (purchaseResult.status === 200) {
              console.log("Покупка обработана успешно на бэкенде.");
              // Отобразите сообщение об успехе пользователю, обновите UI и т.д.
            } else {
              console.error("Бэкенд не смог обработать покупку:", purchaseResult);
              setError("Не удалось подтвердить покупку. Пожалуйста, попробуйте еще раз."); // Сообщите пользователю.
            }
          } catch (backendError) {
            console.error("Ошибка при отправке подтверждения покупки на бэкенд:", backendError);
            setError("Не удалось подтвердить покупку. Пожалуйста, попробуйте еще раз.");
          }
        } else {
          console.log("Оплата не удалась или отменена:", status);
          setError("Оплата не удалась или отменена."); // Сообщите пользователю.
        }
      });

    } catch (error) {
      console.error("Ошибка при создании или открытии инвойса:", error);
      setError(error.message || "Произошла ошибка во время покупки."); //Предоставьте сообщение об ошибке пользователю
      setIsLoading(false);
    } finally {
      setIsLoading(false); // Убедитесь, что загрузка остановлена в любом случае
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
              disabled={!isActive || isLoading}
            >
              {isLoading ? "Loading..." : "0.7K"}
            </button>
          </div>
          <section className='mid-section-list'>
            <TON />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>Больше действий
            <span className='text-power-hr-ton'>0.072 BTS/час</span>
          </div>
        </article>
      </div>
      {error && <div className="error-message">{error}</div>}
    </section>
  );
}

export default ListsContainerFirst;