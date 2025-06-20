import React, { useState } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';

function ListsContainerFirst({ isActive }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuyClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const invoiceData = {
        title: "TON Boost",
        description: "Increase power by 0.072 BTS/hr",
        payload: JSON.stringify({ item_id: "ton_boost" }),
        currency: "XTR",
        prices: [{ amount: 1, label: "TON Boost" }],
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
      const { invoiceLink } = response.data;

      window.Telegram.WebApp.openInvoice(invoiceLink, (status) => {
        console.log("Invoice status:", status); // Add this line for debugging
        if (status === "paid") {
          // Успешная оплата будет обработана вебхуком.
          // Здесь не нужно отображать сообщение об успехе.
          console.log("Payment successful (handled by webhook)!");
        } else {
          console.log("Payment failed or canceled:", status);
          setError("Payment failed or canceled.");
        }
        setIsLoading(false);
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
              disabled={!isActive || isLoading}
            >
              {isLoading ? "Loading..." : "0.7K"}
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
      {error && <div className="error-message">{error}</div>}
    </section>
  );
}

export default ListsContainerFirst;