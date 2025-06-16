import React from 'react';
import TON from '../../Most Used/Image/TON';

function ListsContainerFirst() {

  const handleBuyTon = async () => {
    try {
      const price = 700; // Цена в звездах (указана на кнопке 0.7K)

      // Запрос на сервер для создания ссылки на инвойс
      const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', { // Путь к вашей Netlify Function
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'TON Booster',
          description: 'Boost your power!',
          payload: 'ton_booster_purchase', // Уникальный идентификатор покупки
          price: price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const invoiceUrl = data.invoiceUrl;

        // Проверяем, что Telegram WebApp доступен
        if (window.Telegram && window.Telegram.WebApp) {
          // Открываем инвойс
          window.Telegram.WebApp.openInvoice(invoiceUrl, (status) => {
            // Коллбэк после закрытия инвойса
            if (status === 'paid') {
              window.Telegram.WebApp.showAlert('Payment successful! You have received the TON Booster.');
              // Здесь можно выполнить действия после успешной оплаты
            } else {
              window.Telegram.WebApp.showAlert('Payment failed or was cancelled.');
              // Здесь можно обработать неудачную оплату
            }
          });
        } else {
          console.error("Telegram WebApp is not available.");
          alert("Telegram WebApp is not available. Please try again later."); // Простой fallback
        }
      } else {
        alert(`Error creating invoice: ${data.error}`); // Простой fallback
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('An error occurred during the purchase process.'); // Простой fallback
    }
  };

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button className='ListButtonTon' onClick={handleBuyTon}>0.7K</button>
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