import React, { useState } from 'react';
import TON from '../../Most Used/Image/TON';
import { useTelegram } from './useTelegram'; // Предполагается, что у вас есть хук для Telegram Web App
import axios from 'axios'; // Установите: npm install axios

function ListsContainerFirst() {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const { tg } = useTelegram(); // Получаем объект Telegram Web App из хука

  const handleBuyClick = async () => {
    try {
      // Данные для создания Invoice Link (измените на свои)
      const invoiceData = {
        title: "TON Boost",
        description: "Увеличение мощности на 0.072 BTS/hr",
        payload: JSON.stringify({ item_id: "ton_boost" }), // Важно для отслеживания покупки
        currency: "XTR", // Telegram Stars
        prices: [{ amount: 100, label: "TON Boost" }], // Цена в сотых долях звезды (100 = 1 звезда)
      };

      // Вызываем Netlify Function для создания Invoice Link
      const response = await axios.post('https://ah-user.netlify.app/.netlify/functions/create-invoice', invoiceData);
      const { invoiceLink: newInvoiceLink } = response.data;
      setInvoiceLink(newInvoiceLink);

      // Открываем Invoice Link в Telegram Web App
      tg.openInvoice(newInvoiceLink, (status) => {
        if (status === "paid") {
          // Обрабатываем успешную оплату (например, отправляем запрос на бэкенд для выдачи предмета)
          console.log("Оплата прошла успешно!");
          // TODO: Отправьте запрос на ваш бэкенд для выдачи предмета пользователю
        } else {
          // Обрабатываем неудачную оплату или отмену
          console.log("Оплата не удалась или отменена:", status);
        }
      });

    } catch (error) {
      console.error("Error creating or opening invoice:", error);
      // TODO: Обработайте ошибку (например, покажите сообщение пользователю)
    }
  };

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button className='ListButtonTon' onClick={handleBuyClick}>0.7K</button>
          </div>
          <section className='mid-section-list'>
            <TON />
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