import React from 'react';
import TON from '../../Most Used/Image/TON';
import { invoice } from '@telegram-apps/sdk';

function ListsContainerFirst() {
  // Функция для генерации уникального слага
  const generateSlug = () => {
    return `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`; // Генерация более сложного слага
  };

  const handlePayment = async () => {
    if (invoice.isSupported()) {
      try {
        if (invoice.open.isAvailable()) {
          const slug = generateSlug();
          const amount = 700;

          // Открываем счет-фактуру с уникальным слагом и нужной суммой
          const promise = invoice.open(slug, { amount });
          const status = await promise;
          console.log('Invoice opened:', status);
          // Здесь можно добавить уведомление для пользователя о успешном открытии счета
        } else {
          console.error('Invoice opening is not available.');
        }
      } catch (error) {
        console.error('Error opening invoice:', error);
        // Здесь можно добавить уведомление для пользователя о возникшей ошибке
      }
    } else {
      console.error('Invoices are not supported in this version of Telegram Mini Apps.');
    }
  };

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button className='ListButtonTon' onClick={handlePayment}>0.7K</button>
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
