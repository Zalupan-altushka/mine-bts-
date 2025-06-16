import React , {useState} from 'react';
import TON from '../../Most Used/Image/TON';

function ListsContainerFirst() {
  const [log, setLog] = useState(''); // State to store logs
  const [price, setPrice] = useState(null);
  const [title, setTitle] = useState(''); // State for title
  const [description, setDescription] = useState(''); // State for description
  const [payload, setPayload] = useState(''); // State for payload

  const handleBuyTon = async (event) => {
    event.preventDefault();

    try {
      const priceFromButton = parseInt(event.target.dataset.price, 10);

        if (isNaN(priceFromButton)) {
            setLog((prevLog) => prevLog + '\nНекорректная цена.');
            return;
        }

      setPrice(priceFromButton);
      setTitle('TON Booster');
      setDescription('Boost your TON power!');
      setPayload('ton_booster_purchase');

      setLog(
        (prevLog) =>
          `${prevLog}\nПеред fetch - title: ${title}, description: ${description}, payload: ${payload}, price: ${price}`
      ); // Log before fetch

      const requestBody = {
        title: title,
        description: description,
        payload: payload,
        price: price,
      };

      setLog((prevLog) => prevLog + '\nRequest Body: ' + JSON.stringify(requestBody));

      const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      setLog((prevLog) => prevLog + '\nResponse Status: ' + response.status);
      // ... остальной код ...
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