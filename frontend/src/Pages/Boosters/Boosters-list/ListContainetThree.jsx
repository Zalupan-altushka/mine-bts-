import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import BitcoinBr from '../img-jsx-br/BitcoinBr';
import EthereumBr from '../img-jsx-br/EthereumBr';
import CheckIconBr from '../img-jsx-br/CheckIconBr';


function ListContainerThree({ isActive }) {
  const [isLoadingETH, setIsLoadingETH] = useState(false);
  const [isLoadingBTC, setIsLoadingBTC] = useState(false);
  const [isPurchasedETH, setIsPurchasedETH] = useState(false);
  const [isPurchasedBTC, setIsPurchasedBTC] = useState(false);
   const [webApp, setWebApp] = useState(null);

    useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setWebApp(window.Telegram.WebApp);
    }
  }, []);

  const handleBuyClick = async (itemType) => {
    let setIsLoading, setIsPurchased, title, description, prices, item_id;

    if (itemType === "eth") {
      setIsLoading = setIsLoadingETH;
      setIsPurchased = setIsPurchasedETH;
      title = "ETH Boost";
      description = "Increase power by 48.472 BTS/hr";
      prices = [{ amount: 3.9, label: "ETH Boost" }]; // 3.9 Stars
      item_id = "eth_boost";
    } else if (itemType === "btc") {
      setIsLoading = setIsLoadingBTC;
      setIsPurchased = setIsPurchasedBTC;
      title = "BTC Boost";
      description = "Increase power by 68.172 BTS/hr";
      prices = [{ amount: 5.9, label: "BTC Boost" }]; // 5.9 Stars
      item_id = "btc_boost";
    } else {
      console.error("Invalid itemType:", itemType);
      return;
    }

    setIsLoading(true);

    try {
      const invoiceData = {
        title: title,
        description: description,
        payload: JSON.stringify({ item_id: item_id, user_id: webApp.initDataUnsafe.user.id }),
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
              if (itemType === "eth") {
                setIsPurchasedETH(true);
              } else if (itemType === "btc") {
                setIsPurchasedBTC(true);
              }
            } else {
              console.error("Payment verification failed:", verificationResponse.data.error);
            }
          } catch (verificationError) {
            console.error("Error verifying payment:", verificationError);
          }

        } else {
          console.log("Payment failed or canceled:", status);
        }
      });
    } catch (error) {
      console.error("Error creating or opening invoice:", error);
      setIsLoading(false);
    }
  };

  const getButtonContent = (itemType) => {
    if (itemType === "eth") {
      return isPurchasedETH ? <CheckIconBr /> : "1.0K";
    } else if (itemType === "btc") {
      return isPurchasedBTC ? <CheckIconBr /> : "1.3k";
    }
    return null;
  };

  const getButtonClassName = (itemType) => {
    let className = "";
    if (itemType === "eth") {
      className = "ListButtonETH";
      if (isLoadingETH) className += " loading";
      if (isPurchasedETH) className += " purchased";
    } else if (itemType === "btc") {
      className = "ListButtonBTC";
      if (isLoadingBTC) className += " loading";
      if (isPurchasedBTC) className += " purchased";
    }
    return className;
  };

  return (
    <section className='lists-container'>
      <article className='boosters-list-ETH'>
        <section className='list'>
          <div className='hight-section-list'>
            <span>ETH</span>
            <button
              className={getButtonClassName("eth")}
              onClick={() => handleBuyClick("eth")}
              disabled={!isActive || isLoadingETH || isPurchasedETH || !webApp}
            >
              {getButtonContent("eth")}
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
              className={getButtonClassName("btc")}
              onClick={() => handleBuyClick("btc")}
              disabled={!isActive || isLoadingBTC || isPurchasedBTC || !webApp}
            >
              {getButtonContent("btc")}
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