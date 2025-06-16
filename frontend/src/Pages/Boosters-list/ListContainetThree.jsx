import React from 'react';
import './List.css'
import Ethereum from '../../Most Used/Image/Ethereum';
import Bitcoin from '../../Most Used/Image/Bitcoin';
import { useTelegramWebApp } from '@twa-dev/sdk';

function ListContainetThree() {
  const { WebApp } = useTelegramWebApp();

  const handleBuyETH = async () => {
    try {
      const amount = 3900;
      const description = "Purchase 3.9K ETH Boost";
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

  const handleBuyBTC = async () => {
    try {
      const amount = 5900;
      const description = "Purchase 5.9K BTC Boost";
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
      <article className='boosters-list-ETH'>
        <section className='list'>
          <div className='hight-section-list'>
            <span>ETH</span>
            <button className='ListButtonETH' onClick={handleBuyETH}>3.9K</button>
          </div>
          <div className='mid-section-list'>
            <Ethereum />
          </div>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-ETH'>48.472 BTS/hr</span>
          </div>
        </section>
      </article>
      <article className='boosters-list-BTS'>
        <section className='list'>
          <div className='hight-section-list'>
            <span>BTC</span>
            <button className='ListButtonBTC' onClick={handleBuyBTC}>5.9k</button>
          </div>
          <section className='mid-section-list'>
            <Bitcoin />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-BTS'>68.172 BTS/hr</span>
          </div>
        </section>
      </article>
    </section>
  );
}

export default ListContainetThree;