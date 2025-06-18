import React from 'react';
import TON from '../../Most Used/Image/TON';
import WebApp from "@twa-dev/sdk";  // Import WebApp
import './ListsContainerFirst.css'; // Import CSS

function ListsContainerFirst() {

    const handleBuyBooster = () => {
        const price = 700; // Price in Stars
        const userFromTelegram = window.Telegram.WebApp.initDataUnsafe.user;
        const userId = userFromTelegram?.id;

        // Generate a unique payload (order ID)
        const payload = `order_${Date.now()}_${userId}`; // Use a more robust method

        const invoiceParams = {
            title: `Booster for ${price} Stars`,
            description: `Buying a booster for ${price} Stars`,
            payload: payload,
            provider_token: process.env.REACT_APP_TELEGRAM_TOKEN, // Store token in .env file
            currency: "XTR", // Or any supported currency
            prices: [{ label: "Booster", amount: price * 100 }], // Amount in cents
        };

        WebApp.openInvoice(invoiceParams);

        // WebApp.openInvoice is asynchronous and doesn't directly return a status.
        // You'll receive updates via the webhook (see backend code)
        // and the invoiceClosed event.  You can't reliably know if the payment
        // was successful immediately after calling openInvoice.  You need to
        // handle the asynchronous notification.
    };


    return (
        <section className='lists-container'>
            <div className='list'>
                <article className='boosters-list-ton'>
                    <div className='hight-section-list'>
                        <span>TON</span>
                        <button className='ListButtonTon' onClick={handleBuyBooster}>0.7K</button>
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