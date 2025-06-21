import React, { useState } from 'react';
import './List.css';
import axios from 'axios';
import BitcoinBr from '../img-jsx-br/BitcoinBr';
import EthereumBr from '../img-jsx-br/EthereumBr';

function ListContainerThree({ isActive }) {
  const [isLoadingETH, setIsLoadingETH] = useState(false);
  const [isLoadingBTC, setIsLoadingBTC] = useState(false);
  const [errorETH, setErrorETH] = useState(null);
  const [errorBTC, setErrorBTC] = useState(null);

  const handleBuyClick = async (itemType) => {
    let setIsLoading, setError, title, description, prices;

    if (itemType === "eth") {
      setIsLoading = setIsLoadingETH;
      setError = setErrorETH;
      title = "ETH Boost";
      description = "Increase power by 48.472 BTS/hr";
      prices = [{ amount: 10, label: "ETH Boost" }]; // 3.9 Stars
    } else if (itemType === "btc") {
      setIsLoading = setIsLoadingBTC;
      setError = setErrorBTC;
      title = "BTC Boost";
      description = "Increase power by 68.172 BTS/hr";
      prices = [{ amount: 10, label: "BTC Boost" }]; // 5.9 Stars
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
      <article className='boosters-list-ETH'>
        <section className='list'>
          <div className='hight-section-list'>
            <span>ETH</span>
            <button
              className='ListButtonETH'
              onClick={() => handleBuyClick("eth")}
              disabled={!isActive || isLoadingETH}
            >
              {isLoadingETH ? <span style={{ fontSize: '8px' }}>Wait...</span> : "1.0K"}
            </button>
          </div>
          <div className='mid-section-list'>
            <EthereumBr />
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
            <button
              className='ListButtonBTC'
              onClick={() => handleBuyClick("btc")}
              disabled={!isActive || isLoadingBTC}
            >
              {isLoadingBTC ? <span style={{ fontSize: '8px' }}>Wait...</span> : "1.3k"}
            </button>
          </div>
          <section className='mid-section-list'>
            <BitcoinBr />
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

export default ListContainerThree;