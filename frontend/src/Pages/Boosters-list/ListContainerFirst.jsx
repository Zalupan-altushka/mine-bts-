import React, { useState, useEffect, useRef } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';

function ListsContainerFirst({ isActive }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [webApp, setWebApp] = useState(null);
  const [logs, setLogs] = useState([]); // Состояние для хранения логов
  const logsRef = useRef(logs); // Ref для доступа к logs в асинхронных функциях

  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);

  const log = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleBuyClick = async () => {
    setIsLoading(true);
    setError(null);
    setLogs([]); // Очищаем логи при каждом клике

    if (!webApp) {
      setError("Telegram WebApp не инициализирован");
      setIsLoading(false);
      return;
    }

    try {
      const invoiceData = {
        title: "TON Booster",
        description: "Increase power by 0.072 BTS/hr",
        payload: JSON.stringify({ item_id: "ton_boost", user_id: webApp.initDataUnsafe.user.id }), // Добавляем user_id
        currency: "XTR",
        prices: [{ amount: 1, label: "TON Boost" }],
      };

      log(`invoiceData: ${JSON.stringify(invoiceData)}`);

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

      log(`invoiceLink: ${newInvoiceLink}`);

      webApp.openInvoice(newInvoiceLink, async (status) => {
        setIsLoading(false);
        log(`openInvoice status: ${status}`);

        if (status === "paid") {
          log("Payment successful!");

          // Верификация платежа на сервере
          try {
            log("Вызов verify-payment...");
            const verificationResponse = await axios.post(
              'https://ah-user.netlify.app/.netlify/functions/verify-payment',
              {
                payload: invoiceData.payload,
                user_id: webApp.initDataUnsafe.user.id
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            log(`verify-payment response status: ${verificationResponse.status}`);
            log(`verify-payment response data: ${JSON.stringify(verificationResponse.data)}`);

            if (verificationResponse.data.success) {
              log("Payment verified successfully!");
              // TODO:  Обработка успешной верификации (выдача товара, обновление БД)
            } else {
              log(`Payment verification failed: ${verificationResponse.data.error}`);
              setError("Payment verification failed. Please contact support.");
            }
          } catch (verificationError) {
            log(`Error verifying payment: ${verificationError}`);
            setError("Error verifying payment. Please contact support.");
          }


        } else {
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
          <div className="logs-container"> {/* Добавляем контейнер для логов */}
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