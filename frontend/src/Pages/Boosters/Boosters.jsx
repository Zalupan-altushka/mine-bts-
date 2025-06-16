import './Boosters.css'
import Menu from '../../Most Used/Menu/Menu';
import ListContainetThree from '../Boosters-list/ListContainetThree';
import ListsContainerFirst from '../Boosters-list/ListContainerFirst';
import ListsContainerSecond from '../Boosters-list/ListContainerSecond';
import BoostersBox from './Containers/BoostersBox';
import React, { useState } from 'react'; // Import useState

function Boosters({ userData }) {
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleBuy = async (boosterName, price) => {
    try {
      setErrorMessage(''); // Clear previous error message
      const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booster: boosterName, price }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      if (!data.invoiceLink) {
        throw new Error("Сервер не вернул ссылку на оплату.");
      }

      // Используем Telegram WebApp SDK для открытия инвойса
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.openInvoice) {
        window.Telegram.WebApp.openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setErrorMessage("Оплата прошла успешно!"); // Use setErrorMessage instead of alert
            // TODO: Обновить состояние приложения (например, добавить бустер пользователю)
          } else {
            setErrorMessage("Оплата не завершена. Статус: " + status); // Use setErrorMessage instead of alert
          }
        });
      } else {
        setErrorMessage("Telegram WebApp SDK недоступен.  Пожалуйста, откройте приложение в Telegram."); // Use setErrorMessage instead of alert
      }


    } catch (e) {
      let errorMessageText = "Произошла ошибка: " + e.message;

      // Добавляем больше информации, если она доступна
      if (e.response && e.response.status) {
        errorMessageText += ` (HTTP ${e.response.status})`;
      }

      setErrorMessage(errorMessageText); // Update error message state
    }
  };

  return (
    <section className='bodyboostpage'>
      <BoostersBox />
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
      <div className='containers-scroll-wrapper'>
        <div className='center-content'>
          <ListsContainerFirst onBuy={handleBuy} />
          <ListsContainerSecond />
          <ListContainetThree />
        </div>
      </div>
      <Menu />
    </section>
  );
}

export default Boosters;