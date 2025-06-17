import React, { useState, useEffect } from 'react'; // Import useEffect
import TON from '../../Most Used/Image/TON';
import { useTelegram } from '@twa-dev/sdk'; // Direct import

function ListsContainerFirst() {
  const { WebApp } = useTelegram(); // Access the WebApp object

  const [invoiceLink, setInvoiceLink] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    // WebApp.ready() is important for initializing the Web App environment.
    // Call it inside useEffect to ensure it's only called once after the component mounts.
    WebApp.ready();
  }, [WebApp]); // Add WebApp as a dependency to useEffect

  const handlePurchase = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch('/.netlify/functions/create-invoice', {  // Updated URL for Netlify Function
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const invoiceLink = data.invoiceLink;

      if (!invoiceLink) {
        console.error('Invoice link is missing in the response.');
        return;
      }

      WebApp.openInvoice(invoiceLink, (status) => {
        setIsLoading(false); // Stop loading in callback
        console.log('Invoice Status:', status);
        if (status === 'paid') {
          // Handle successful payment (e.g., update user balance, show confirmation)
          alert('Payment successful! 700 Stars deducted.'); // Replace with appropriate UI
        } else if (status === 'failed') {
          alert('Payment failed. Please try again.'); // Replace with appropriate UI
        } else if (status === 'cancelled') {
          alert('Payment cancelled.'); // Replace with appropriate UI
        } else if (status === 'pending') {
          alert('Payment pending. Please wait.'); // Optional: Handle pending state
        }
      });
    } catch (error) {
      console.error('Error creating/opening invoice:', error);
      setIsLoading(false); // Ensure loading stops on error
      alert('An error occurred. Please try again later.'); // Display error message to user
    }
  };

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button
              className="ListButtonTon"
              onClick={handlePurchase}
              disabled={isLoading} // Отключаем кнопку во время загрузки
            >
              {isLoading ? 'Загрузка...' : '0.7K'}
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