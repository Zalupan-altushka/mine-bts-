import React from 'react';
import TON from '../../Most Used/Image/TON';
import { useTelegramWebApp } from '@twa-dev/sdk'; // Import the hook

function ListsContainerFirst() {
  const { WebApp } = useTelegramWebApp(); // Use the hook to access WebApp

  const handleBuyTon = async () => {
    try {
      const amount = 700; // Amount of Stars (0.7K)
      const description = "Purchase 0.7K TON Boost"; // More descriptive
      const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', {  // Replace with your Netlify function URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount, description: description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const invoiceLink = data.invoiceLink;

      WebApp.openInvoice(invoiceLink, (status) => {
        if (status === "paid") {
          // Handle successful payment (e.g., update UI)
          alert("Payment successful!");
        } else {
          // Handle payment failure or cancellation
          alert("Payment failed or cancelled.");
        }
      });
    } catch (error) {
      console.error("Error creating or opening invoice:", error);
      alert("Error processing payment. Please try again later.");
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