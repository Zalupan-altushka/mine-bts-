import React, { useState, useEffect } from 'react';
import TON from '../../Most Used/Image/TON';
import axios from 'axios';
import CheckIcon2 from '../../Most Used/Image/IMG/CheckIconTon';

function ListsContainerFirst({ isActive }) {
  const [invoiceLink, setInvoiceLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webApp, setWebApp] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setWebApp(window.Telegram.WebApp);
    }
  }, []);

  const boosterInfo = {
    item_id: "ton_boost",
    title: "TON Booster",
    description: "Increase power by 0.072 BTS/hr",
    price: 100,
    currency: "XTR",
  };

  const handleBuyClick = async () => {
    setIsLoading(true);

    if (!webApp) {
      setIsLoading(false);
      return;
    }

    try {
      const invoiceData = {
        title: boosterInfo.title,
        description: boosterInfo.description,
        payload: JSON.stringify({ item_id: boosterInfo.item_id, user_id: webApp.initDataUnsafe.user.id }),
        currency: boosterInfo.currency,
        prices: [{ amount: boosterInfo.price / 100, label: boosterInfo.title }],
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

      webApp.openInvoice(newInvoiceLink, async (status) => {
        setIsLoading(false);

        if (status === "paid") {
          try {
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

            if (verificationResponse.data.success) {
              setIsPurchased(true);
            }
          } catch (verificationError) {
            console.error("Verification Error", verificationError);
          }

        } else if (status === "closed") {
            console.log("Invoice Closed");
        } else {
          console.log("Payment Failed or Canceled", status);
        }
      });

    } catch (error) {
      setIsLoading(false);
      console.error("Invoice Creation Error", error);
    }
  };

  let buttonContent = isPurchased ? <CheckIcon2 /> : "0.7K";

  return (
    <section className='lists-container'>
      <div className='list'>
        <article className='boosters-list-ton'>
          <div className='hight-section-list'>
            <span>TON</span>
            <button
              className={`ListButtonTon ${isPurchased ? 'purchased' : ''}`}
              onClick={handleBuyClick}
              disabled={!isActive || isLoading || !webApp || isPurchased}
            >
              {buttonContent}
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