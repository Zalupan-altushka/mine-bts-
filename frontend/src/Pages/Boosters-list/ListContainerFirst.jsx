import React from 'react';
import TON from '../../Most Used/Image/TON';

function ListsContainerFirst() {
  const handleBuyTon = async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    try {
      const price = parseInt(event.target.dataset.price, 10); // Get price from data-price

      if (isNaN(price)) {
        alert('Некорректная цена.');
        return;
      }
      const title = 'TON Booster'; // Задаем title
      const description = 'Boost your TON power!'; // Задаем description
      const payload = 'ton_booster_purchase'; // Задаем payload

      const requestBody = {
        title: title,
        description: description,
        payload: payload,
        price: price,
      };
      console.log("ListsContainerFirst: Request Body:", requestBody); // LOG

      const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ListsContainerFirst: Error creating invoice:', errorText);
        alert(`Ошибка: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log("ListsContainerFirst: Response Data:", data); // LOG

      if (data.invoiceUrl) {
        window.Telegram.WebApp.openInvoice(data.invoiceUrl, (status) => {
          if (status === 'paid') {
            window.Telegram.WebApp.showAlert('Payment successful!');
            // ...
          } else {
            window.Telegram.WebApp.showAlert('Payment failed or cancelled.');
            // ...
          }
        });
      } else {
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
            <button
              className='ListButtonTon'
              onClick={handleBuyTon}
              data-price="700" // Ensure data-price is set
            >
              0.7K
            </button>
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