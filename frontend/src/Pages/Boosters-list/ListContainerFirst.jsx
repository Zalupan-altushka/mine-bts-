import React, { useState } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';
import CheckIcon from '../../Most Used/Image/CheckIcon';


function ListsContainerFirst({ isActive }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);

  const handleBuyClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const invoiceData = {
        title: "TON Booster",
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
      const { invoiceLink: newInvoiceLink } = response.data;
      setInvoiceLink(newInvoiceLink);

      window.Telegram.WebApp.openInvoice(newInvoiceLink, async (status) => { // Используем async/await
        console.log("Invoice status:", status); // Log the status

        if (status === "paid") {
          console.log("Payment successful!");
          const telegram_user_id = window.Telegram.WebApp.initDataUnsafe.user.id;
          const item_id = JSON.parse(invoiceData.payload).item_id;

          try {
            const applyBoosterResponse = await axios.post('https://ah-user.netlify.app/.netlify/functions/apply-booster', { telegram_user_id, item_id }); // Используем await
            console.log("Booster applied:", applyBoosterResponse.data);
            setIsPurchased(true); // Set isPurchased to true after successful payment and booster application
          } catch (applyBoosterError) {
            console.error("Error applying booster:", applyBoosterError);
            setError(applyBoosterError.message);
            setIsPurchased(false); // Reset isPurchased if applying booster fails
          }
        } else {
          console.log("Payment failed or canceled:", status);
          setIsPurchased(false); // Reset isPurchased if payment fails or is canceled
        }
        setIsLoading(false); // Stop loading, regardless of the result
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
              disabled={!isActive || isLoading || isPurchased}
              style={{
                backgroundColor: isPurchased ? '#1c1c1e' : '',
                color: isPurchased ? '#b9bbbc' : '',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px' // Adjusted font size for the icon
              }}
            >
              {isLoading ? <span style={{ fontSize: '9px' }}>Wait...</span> : (isPurchased ? <span style={{ fontSize: '9px' }}><CheckIcon /></span> : "0.1K")}
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