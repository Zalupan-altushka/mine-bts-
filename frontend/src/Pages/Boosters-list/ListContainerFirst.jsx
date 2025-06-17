import React , {useState , useCallback , useRef, useEffect} from 'react';
import TON from '../../Most Used/Image/TON';

function ListsContainerFirst() {
    const [log, setLog] = useState('');
    const [price, setPrice] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [payload, setPayload] = useState('');
    const [requestBody, setRequestBody] = useState(null);

    // Use useRef to hold a reference to the 'sendRequest' function
    const sendRequestRef = useRef(null);

    // Define 'sendRequest' using useCallback to prevent unnecessary re-renders
    const sendRequest = useCallback(async () => {
        if (!requestBody) {
            setLog((prevLog) => prevLog + '\nRequest body is not yet available.');
            return;
        }

        const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
            console.error('Error creating invoice:', response.status, responseText);
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
    }, [requestBody]); // Include 'requestBody' in the dependencies array

    // Update the useRef with the latest 'sendRequest' function
    useEffect(() => {
        sendRequestRef.current = sendRequest;
    }, [sendRequest]);

    useEffect(() => {
        // Log the state variables
        setLog(
            (prevLog) =>
                `${prevLog}\nПеред fetch - title: ${title}, description: ${description}, payload: ${payload}, price: ${price}`
        );
    }, [title, description, payload, price]);

    useEffect(() => {
        // Update requestBody whenever ALL states are available
        if (price && title && description && payload) {
            const newRequestBody = {
                title: title,
                description: description,
                payload: payload,
                price: price,
            };
            console.log("newRequestBody:", newRequestBody);
            setRequestBody(newRequestBody);
            setLog((prevLog) => prevLog + '\nRequest Body: ' + JSON.stringify(newRequestBody));
        }
    }, [title, description, payload, price]);


    const handleBuyTon = async (event) => {
        event.preventDefault();

        try {
            const priceFromButton = parseInt(event.target.dataset.price, 10);
            const titleFromButton = event.target.dataset.title
            const descriptionFromButton = event.target.dataset.description
            const payloadFromButton = event.target.dataset.payload

            console.log('Price from button:', priceFromButton);

            if (isNaN(priceFromButton)) {
                setLog((prevLog) => prevLog + '\nНекорректная цена.');
                return;
            }
            setPrice(priceFromButton); // Update the price state
            setTitle(titleFromButton)
            setDescription(descriptionFromButton)
            setPayload(payloadFromButton)


        } catch (error) {
            console.error('Error during purchase:', error);
            setLog((prevLog) => prevLog + '\nError during purchase: ' + error.message);
        }
    };

    useEffect(() => {
        // This useEffect will call sendRequest when requestBody is available
        if (requestBody) {
            // Call the 'sendRequest' function using the useRef
            sendRequestRef.current();
        }
    }, [requestBody]);

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
                data-title ="TON Booster"
                data-description = "Description"
                data-payload = "payload"
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