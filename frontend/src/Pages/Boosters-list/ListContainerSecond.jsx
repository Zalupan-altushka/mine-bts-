import React from 'react';
import CenterApp from '../../Most Used/Image/CenterApp';
import Premium from '../../Most Used/Image/Premium';
import { useTelegramWebApp } from '@twa-dev/sdk';

function ListContainerSecond() {
  const { WebApp } = useTelegramWebApp();

  const handleBuyApps = async () => {
    try {
      const amount = 1500;
      const description = "Purchase 1.5K Apps Boost";
      const response = await fetch('/.netlify/functions/create-invoice', {
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
          alert("Payment successful!");
        } else {
          alert("Payment failed or cancelled.");
        }
      });
    } catch (error) {
      console.error("Error creating or opening invoice:", error);
      alert("Error processing payment. Please try again later.");
    }
  };

  const handleBuyPremium = async () => {
    try {
      const amount = 2700;
      const description = "Purchase 2.7K Premium Boost";
      const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', {
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
          alert("Payment successful!");
        } else {
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
      <article className='boosters-list-center'>
        <div className='list'>
          <div className='hight-section-list'>
            <span>Apps</span>
            <button className='ListButtonCenter' onClick={handleBuyApps}>1.5K</button>
          </div>
          <section className='mid-section-list'>
            <CenterApp />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-center'>18.472 BTS/hr</span>
          </div>
        </div>
      </article>
      <article className='boosters-list-prm'>
        <div className='list'>
          <div className='hight-section-list'>
            <span>Prem</span>
            <button className='ListButtonPrm' onClick={handleBuyPremium}>2.7k</button>
          </div>
          <section className='mid-section-list'>
            <Premium />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-bts'>38.172 BTS/hr</span>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ListContainerSecond;