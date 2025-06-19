import React from 'react';
import TON from '../../Most Used/Image/TON';
import CheckIcon from '../../Most Used/Image/CheckIcon';

function ListsContainerFirst({ isActive }) {

  const generatePaymentLink = (boosterId) => {
    const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
    const payload = { boosterId: boosterId, userId: userId };
    const payloadString = JSON.stringify(payload);
    const encodedPayload = encodeURIComponent(payloadString);
    return `https://t.me/@mine_bts_bot?startapp=${encodedPayload}`; // Замените YOUR_BOT_USERNAME
  };

  const handleBuyClick = (boosterId) => {
    const paymentLink = generatePaymentLink(boosterId);
    window.location.href = paymentLink; // Перенаправляем пользователя в бот
  };

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button
              className='ListButtonTon'
              onClick={() => handleBuyClick("ton_boost")}
            >
              0.1k
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