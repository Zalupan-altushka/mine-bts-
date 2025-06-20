import React, { useState } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';

function ListsContainerFirst({ isActive }) { // Get isActive as a prop
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const handleBuyClick = async () => {
    setIsLoading(true); // Start loading
    setError(null); // Clear any previous errors
    try {
      // Data for creating the Invoice Link
      const invoiceData = {
        title: "TON Boost",
        title: "TON Booster",
        description: "Increase power by 0.072 BTS/hr",
        payload: JSON.stringify({ item_id: "ton_boost" }), // Important for tracking purchases
        currency: "XTR", // Telegram Stars
        prices: [{ amount: 100, label: "TON Boost" }], // Price in hundredths of a star (100 = 1 star)
      };

      console.log("invoiceData:", invoiceData); // Add this line to check invoiceData

      // Call the Netlify Function to create the Invoice Link
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

      // Open the Invoice Link in the Telegram Web App
      window.Telegram.WebApp.openInvoice(newInvoiceLink, (status) => {
        if (status === "paid") {
          // Handle successful payment (e.g., send a request to the backend to issue the item)
          console.log("Payment successful!");
          // TODO: Send a request to your backend to issue the item to the user
        } else {
          // Handle failed or canceled payment
          console.log("Payment failed or canceled:", status);
        }
        setIsLoading(false); // Stop loading
      });

    } catch (error) {
      console.error("Error creating or opening invoice:", error);
      setError(error.message); // Set the error message
      setIsLoading(false); // Stop loading
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
            <span className='text-power-hr-ton'>0.072 BTS/hr</span>More actions
          </div>
        </article>
      </div>
    </section>
  );
}