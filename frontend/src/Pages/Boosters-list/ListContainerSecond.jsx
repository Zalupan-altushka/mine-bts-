import React, { useState } from 'react';
import CenterApp from '../../Most Used/Image/CenterApp';
import Premium from '../../Most Used/Image/Premium';
import axios from 'axios';

function ListContainerSecond({ isActive }) {
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isLoadingPrem, setIsLoadingPrem] = useState(false);
  const [errorApps, setErrorApps] = useState(null);
  const [errorPrem, setErrorPrem] = useState(null);

  const handleBuyClick = async (itemType) => {
    let setIsLoading, setError, title, description, prices;

    if (itemType === "apps") {
      setIsLoading = setIsLoadingApps;
      setError = setErrorApps;
      title = "Apps Booster";
      description = "Increase power by 18.472 BTS/hr";
      prices = [{ amount: 10, label: "Apps Boost" }]; // 1.5 Stars
    } else if (itemType === "prem") {
      setIsLoading = setIsLoadingPrem;
      setError = setErrorPrem;
      title = "Prem Booster";
      description = "Increase power by 38.172 BTS/hr";
      prices = [{ amount: 10, label: "Prem Boost" }]; // 2.7 Stars
    } else {
      console.error("Invalid itemType:", itemType);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const invoiceData = {
        title: title,
        description: description,
        payload: JSON.stringify({ item_id: itemType + "_boost" }),
        currency: "XTR",
        prices: prices,
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

      window.Telegram.WebApp.openInvoice(newInvoiceLink, (status) => {
        if (status === "paid") {
          console.log("Payment successful!");
          // TODO: Send a request to your backend to issue the item to the user
        } else {
          console.log("Payment failed or canceled:", status);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error creating or opening invoice:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <section className='lists-container'>
      <article className='boosters-list-center'>
        <div className='list'>
          <div className='hight-section-list'>
            <span>Apps</span>
            <button
              className='ListButtonCenter'
              onClick={() => handleBuyClick("apps")}
              disabled={!isActive || isLoadingApps}
            >
              {isLoadingApps ? <span style={{ fontSize: '8px' }}>Wait...</span> : "0.3K"}
            </button>
          </div>
          <section className='mid-section-list'>
            <CenterApp />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-center'>18.472 BTS/hr</span>
          </div>
          {errorApps && <p style={{ color: 'red' }}>Error: {errorApps}</p>}
        </div>
      </article>
      <article className='boosters-list-prm'>
        <div className='list'>
          <div className='hight-section-list'>
            <span>Prem</span>
            <button
              className='ListButtonPrm'
              onClick={() => handleBuyClick("prem")}
              disabled={!isActive || isLoadingPrem}
            >
              {isLoadingPrem ? <span style={{ fontSize: '8px' }}>Wait...</span> : "0.5k"}
            </button>
          </div>
          <section className='mid-section-list'>
            <Premium />
          </section>
          <div className='footer-section-list'>
            <span className='text-power'>Power</span>
            <span className='text-power-hr-bts'>38.172 BTS/hr</span>
          </div>
          {errorPrem && <p style={{ color: 'red' }}>Error: {errorPrem}</p>}
        </div>
      </article>
    </section>
  );
}

export default ListContainerSecond;