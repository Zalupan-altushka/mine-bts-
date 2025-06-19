import React, { useState, useEffect } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';
import CheckIcon from '../../Most Used/Image/CheckIcon';

function ListsContainerFirst({ isActive }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [boosterStatus, setBoosterStatus] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  useEffect(() => {
    // Listen for pre_checkout_query event
    window.Telegram.WebApp.onEvent('preCheckoutQuery', (query) => {
      addLog(`Received pre_checkout_query: ${JSON.stringify(query)}`);
      if (query && query.id) {
        // Validate the query (e.g., check if the item is available)
        const isValid = true; // Replace with your validation logic

        if (isValid) {
          addLog(`Answering pre_checkout_query with success`);
          window.Telegram.WebApp.answerPreCheckoutQuery({
            pre_checkout_query_id: query.id,
            ok: true,
          });
        } else {
          addLog(`Answering pre_checkout_query with error: Item is not available.`);
          window.Telegram.WebApp.answerPreCheckoutQuery({
            pre_checkout_query_id: query.id,
            ok: false,
            error_message: "Item is not available.",
          });
        }
      } else {
        console.warn("Invalid pre_checkout_query received.");
        addLog("Invalid pre_checkout_query received.");
      }
    });

    // Listen for successfulPayment event
    window.Telegram.WebApp.onEvent('successfulPayment', () => {
      addLog("Received successful_payment event");
      setBoosterStatus("Payment successful!");
      setIsPurchased(true);
      setIsLoading(false);
    });

    // Cleanup function (optional) - remove event listeners when component unmounts
    return () => {
      window.Telegram.WebApp.offEvent('preCheckoutQuery');
      window.Telegram.WebApp.offEvent('successfulPayment');
    };
  }, []); // Run this effect only once on component mount

  const handleBuyClick = async () => {
    setIsLoading(true);
    setError(null);
    setBoosterStatus(null);
    setLogs([]);
    addLog("Starting purchase process...");

    try {
      const invoiceData = {
        title: "TON Booster",
        description: "Increase power by 0.072 BTS/hr",
        payload: JSON.stringify({ item_id: "ton_boost" }),
        currency: "XTR",
        prices: [{ amount: 10, label: "TON Boost" }], // ЦЕНА: 1 звезда (100 сотых)
      };
      addLog(`Invoice data: ${JSON.stringify(invoiceData)}`);

      const response = await axios.post(
        'https://ah-user.netlify.app/.netlify/functions/create-invoice',
        invoiceData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
      }

      const { invoiceLink: newInvoiceLink } = response.data;
      setInvoiceLink(newInvoiceLink);
      addLog(`Generated invoice link: ${newInvoiceLink}`);

      window.Telegram.WebApp.openInvoice(newInvoiceLink, async (status) => {
        addLog(`Invoice status: ${status}`);
        if (status === "paid") {
          addLog("Payment successful!");
          setBoosterStatus("Payment successful!");
          setIsPurchased(true);
        } else if (status === "failed") {
          addLog("Payment failed.");
          setBoosterStatus("Payment failed.");
          setIsPurchased(false);
        } else if (status === "cancelled") {
          addLog("Payment cancelled.");
          setBoosterStatus("Payment cancelled.");
          setIsPurchased(false);
        } else {
          addLog("Unknown payment status.");
          setBoosterStatus("Unknown payment status.");
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error creating or opening invoice:", error);
      setError(error.message);
      setBoosterStatus("Error creating or opening invoice. Please try again.");
      setIsLoading(false);
      addLog(`Error creating invoice: ${error.message}`);
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
                fontSize: '12px' // Adjusted font size for the icon
              }}
            >
              {isLoading ? <span style={{ fontSize: '10px' }}>Wait...</span> : (isPurchased ? <span style={{ fontSize: '12px' }}><CheckIcon /></span> : "0.1K")}
            </button>
          </div>
          <section className='mid-section-list'>
            <TON />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-ton'>0.072 BTS/hr</span>
          </div>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {boosterStatus && <p>{boosterStatus}</p>}
          <div>
            {logs.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ListsContainerFirst;