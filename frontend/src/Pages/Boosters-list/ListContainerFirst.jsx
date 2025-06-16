import React , {useState , useEffect} from 'react';
import TON from '../../Most Used/Image/TON';

function ListsContainerFirst() {
  const [log, setLog] = useState('');
  const [price, setPrice] = useState(null);
  const [title, setTitle] = useState('TON Booster'); // Initialize with default value
  const [description, setDescription] = useState('Boost your TON power!'); // Initialize with default value
  const [payload, setPayload] = useState('ton_booster_purchase'); // Initialize with default value
  const [requestBody, setRequestBody] = useState(null); // State for request body

  useEffect(() => {
        // Update the log whenever the relevant state variables change
        setLog(
            (prevLog) =>
                `${prevLog}\nПеред fetch - title: ${title}, description: ${description}, payload: ${payload}, price: ${price}`
        );
  }, [title, description, payload, price]); // Re-run the effect if these change

    // Effect to create the request body after price has been set
  useEffect(() => {
        if (price !== null) {
            const newRequestBody = {
                title: title,
                description: description,
                payload: payload,
                price: price,
            };
            setRequestBody(newRequestBody);
            setLog((prevLog) => prevLog + '\nRequest Body: ' + JSON.stringify(newRequestBody)); // Log Request Body here
        }
  }, [title, description, payload, price]); // Run when title, description, payload, or price change

  const handleBuyTon = async (event) => {
        event.preventDefault();

        try {
            const priceFromButton = parseInt(event.target.dataset.price, 10);

            if (isNaN(priceFromButton)) {
                setLog((prevLog) => prevLog + '\nНекорректная цена.');
                return;
            }

            setPrice(priceFromButton);

            // Check if request body is available before sending the request
            if (!requestBody) {
                setLog((prevLog) => prevLog + '\nRequest body is not yet available.');
                return;
            }

            const response = await fetch('/.netlify/functions/createInvoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const responseText = await response.text(); // Get the response text
            console.log('Response text:', responseText);

            if (!response.ok) {
                console.error('Error creating invoice:', response.status, responseText); // Log status and the text
                setLog((prevLog) => prevLog + `\nОшибка: ${response.status} - ${responseText}`);
                return;
            }

            try {
                const data = await response.json();
                console.log('Response data:', data);
                setLog((prevLog) => prevLog + '\nResponse Data: ' + JSON.stringify(data));

                if (data.invoiceUrl) {
                    window.Telegram.WebApp.openInvoice(data.invoiceUrl, (status) => {
                        if (status === 'paid') {
                            window.Telegram.WebApp.showAlert('Payment successful!');
                        } else {
                            window.Telegram.WebApp.showAlert('Payment failed or cancelled.');
                        }
                    });
                } else {
                    setLog((prevLog) => prevLog + '\nОшибка: Не удалось получить ссылку на оплату.');
                }
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                setLog((prevLog) => prevLog + `\nОшибка при обработке ответа: ${jsonError.message}`);
            }
        } catch (error) {
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