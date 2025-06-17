import React, { useState } from 'react';
import TON from '../../Most Used/Image/TON';

function ListsContainerFirst() {
    const [log, setLog] = useState('');

    const handleBuyTon = async (event) => {
        event.preventDefault();

        try {
            const price = parseInt(event.target.dataset.price, 10);
            const title = event.target.dataset.title;
            const description = event.target.dataset.description;
            const payload = event.target.dataset.payload;

            if (isNaN(price)) {
                setLog((prevLog) => prevLog + '\nНекорректная цена.');
                return;
            }

            const requestBody = {
                title: title,
                description: description,
                payload: payload,
                price: price,
            };

            setLog((prevLog) => prevLog + '\nRequest Body: ' + JSON.stringify(requestBody));

            const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', { // URL Netlify Function
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (data.error) {
                console.error("Error fetching invoice link:", data.error);
                setLog((prevLog) => prevLog + `\nОшибка: ${data.error}`);
                return;
            }

            const invoiceLink = data.invoiceLink;
            console.log("Invoice Link:", invoiceLink);

            window.Telegram.WebApp.openInvoice(invoiceLink, (status) => {
                if (status === 'paid') {
                    window.Telegram.WebApp.showAlert('Payment successful!');
                } else {
                    window.Telegram.WebApp.showAlert('Payment failed or cancelled.');
                }
            });

        } catch (error) {
            console.error('Error during purchase:', error);
            setLog((prevLog) => prevLog + '\nError during purchase: ' + error.message);
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
                            onClick={handleBuyTon}
                            data-price="700"
                            data-title="TON Booster"
                            data-description="Description"
                            data-payload="payload"
                        >
                            0.7K
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
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>
                <h2>Logs:</h2>
                {log}
            </div>
        </section>
    );
}

export default ListsContainerFirst;