import React, { useState } from 'react';
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
          addLog("Payment successful! Sending data to apply-booster...");
          const telegram_user_id = window.Telegram.WebApp.initDataUnsafe.user.id;
          const item_id = JSON.parse(invoiceData.payload).item_id;
          addLog(`Applying booster - telegram_user_id: ${telegram_user_id}, item_id: ${item_id}`);

          try {
            const applyBoosterResponse = await axios.post('https://ah-user.netlify.app/.netlify/functions/apply-booster', { telegram_user_id, item_id }); // Полный URL
            addLog(`apply-booster response: ${JSON.stringify(applyBoosterResponse.data)}`);
            setBoosterStatus("Booster applied successfully!");
            setIsPurchased(true);
          } catch (applyBoosterError) {
            console.error("Error applying booster:", applyBoosterError);
            setError(applyBoosterError.message);
            setBoosterStatus("Error applying booster. Please try again.");
            setIsPurchased(false);
            addLog(`Error applying booster: ${applyBoosterError.message}`);
          }
        } else {
          addLog("Payment failed or cancelled.");
          setBoosterStatus("Payment failed or cancelled.");
          setIsPurchased(false);
        }
        setIsLoading(false);
      });

      setTimeout(() => {
        addLog(`WebApp is_active: ${window.Telegram.WebApp.isActive}`);
        addLog(`WebApp is_ready: ${window.Telegram.WebApp.isReady}`);
        // Добавьте другие свойства WebApp, которые могут быть полезны
      }, 5000);

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