import React from 'react';
import TON from '../../Most Used/Image/TON';

function ListsContainerFirst() {

  const handleBuyTon = async () => {
    try {
      const price = 700; // Цена в звездах (указана на кнопке 0.7K)

      // Проверка наличия Telegram WebApp
      if (!window.Telegram || !window.Telegram.WebApp) {
        alert('Telegram WebApp недоступен. Пожалуйста, попробуйте позже.');
        return; // Остановить выполнение, если WebApp отсутствует
      }

      const requestBody = {
        title: 'TON Booster',
        description: 'Boost your TON power!',
        payload: 'ton_booster_purchase',
        price: price,
      };

      console.log("ListsContainerFirst: Request Body:", requestBody);  // LOG

      const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("ListsContainerFirst: Response Status:", response.status);  // LOG

      if (!response.ok) {
        const errorText = await response.text(); // Получаем текст ошибки
        console.error('ListsContainerFirst: Error creating invoice:', errorText);
        alert(`Ошибка при создании инвойса: ${errorText}`); // Отображаем текст ошибки
        return;
      }

      const data = await response.json();
      console.log("ListsContainerFirst: Response Data:", data);  // LOG

      if (data.invoiceUrl) {
        window.Telegram.WebApp.openInvoice(data.invoiceUrl, (status) => {
          if (status === 'paid') {
            window.Telegram.WebApp.showAlert('Payment successful! You have received the TON Booster.');
            // Здесь можно выполнить действия после успешной оплаты
          } else {
            window.Telegram.WebApp.showAlert('Payment failed or was cancelled.');
            // Здесь можно обработать неудачную оплату
          }
        });
      } else {
        console.error('ListsContainerFirst: No invoiceUrl in response');
        alert('Ошибка: Не удалось получить ссылку на оплату.');
      }
    } catch (error) {
      console.error('ListsContainerFirst: Error during purchase:', error);
      alert('An error occurred during the purchase process.');
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