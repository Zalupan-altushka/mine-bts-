import React, { useState, useEffect, useRef } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';

function ListsContainerFirst({ isActive }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [webApp, setWebApp] = useState(null);
  const [logs, setLogs] = useState([]);
  const logsRef = useRef(logs);

  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);

  const log = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  // Информация о бустере (должна соответствовать информации в боте)
  const boosterInfo = {
    item_id: "ton_boost",
    title: "TON Booster",
    description: "Increase power by 0.072 BTS/hr",
    price: 100, // Цена в копейках/центах (100 = 1 XTR)
    currency: "XTR",
  };

  const handleBuyClick = async () => {
    setIsLoading(true);
    setError(null);
    setLogs([]);

    if (!webApp) {
      setError("Telegram WebApp не инициализирован");
      setIsLoading(false);
      return;
    }

    try {
      const invoiceData = {
        title: boosterInfo.title, // Используем информацию о бустере
        description: boosterInfo.description, // Используем информацию о бустере
        payload: JSON.stringify({ item_id: boosterInfo.item_id, user_id: webApp.initDataUnsafe.user.id }), // Добавляем user_id
        currency: boosterInfo.currency, // Используем информацию о бустере
        prices: [{ amount: boosterInfo.price / 100, label: boosterInfo.title }], // Цена в XTR (1 XTR = 100 копеек/центов)
      };

      log(`invoiceData: ${JSON.stringify(invoiceData)}`);

      const response = await axios.post(
        '/.netlify/functions/create-invoice',
        invoiceData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { invoiceLink: newInvoiceLink } = response.data;
      setInvoiceLink(newInvoiceLink);

      log(`invoiceLink: ${newInvoiceLink}`);

      webApp.openInvoice(newInvoiceLink, async (status) => {
        setIsLoading(false);
        log(`openInvoice status: ${status}`);

        if (status === "paid") {
          log("Payment considered successful by openInvoice!");

          // **БЕЗ ВЕРИФИКАЦИИ НА СЕРВЕРЕ - ОЧЕНЬ ОПАСНО!**
          log("Выдача товара пользователю...");
          // TODO: Выдать товар пользователю (увеличить баланс, выдать предмет и т.д.)
          log("Товар выдан пользователю.");

        } else if (status === "closed") {
          log("Invoice was closed by user (possible payment pending).");
          setError("Invoice was closed.  Please check your Telegram Stars balance or try again later.");
        }
         else {
          log(`Payment failed or canceled: ${status}`);
          setError(`Payment failed or canceled: ${status}`);
        }

      });

    } catch (error) {
      log(`Error creating or opening invoice: ${error}`);
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
              disabled={!isActive || isLoading || !webApp}
            >
              {isLoading ? "Loading..." : "0.7K"}
            </button>
          </div>
          <section className='mid-section-list'>
            <TON />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>More actions
            <span className='text-power-hr-ton'>0.072 BTS/hr</span>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="logs-container">
            <h3>Logs:</h3>
            <pre>{logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}</pre>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ListsContainerFirst;