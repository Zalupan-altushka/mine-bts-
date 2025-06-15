import './Boosters.css'
import Menu from '../../Most Used/Menu/Menu';
import ListContainetThree from '../Boosters-list/ListContainetThree';
import ListsContainerFirst from '../Boosters-list/ListContainerFirst';
import ListsContainerSecond from '../Boosters-list/ListContainerSecond';
import BoostersBox from './Containers/BoostersBox';

function Boosters({ userData }) {

  const handleBuy = async (boosterName, price) => {
    try {
      const response = await fetch('https://ah-user.netlify.app/.netlify/functions/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booster: boosterName, price }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get invoice link');

      if (window.Telegram?.WebApp?.openInvoice) {
        window.Telegram.WebApp.openInvoice(data.invoiceLink, (status) => {
          if (status === 'paid') {
            alert('Покупка успешна!');
            // Тут можно обновить UI, если нужно
          } else {
            alert('Покупка не была завершена.');
          }
        });
      } else {
        alert('Платёжный интерфейс Telegram недоступен');
      }
    } catch (e) {
      alert('Ошибка: ' + e.message);
    }
  };

  return (
      <section className='bodyboostpage'>
        <BoostersBox />
        <div className='containers-scroll-wrapper'>
          <div className='center-content'>
            <ListsContainerFirst onBuy={handleBuy} />
            <ListsContainerSecond />
            <ListContainetThree />
          </div>
        </div>
        <Menu />
      </section>
  );
}

export default Boosters;