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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      if (!data.invoiceLink) {
        throw new Error("Сервер не вернул ссылку на оплату.");
      }

      // Используем Telegram WebApp SDK для открытия инвойса
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.openInvoice) {
        window.Telegram.WebApp.openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            alert("Оплата прошла успешно!");
            // TODO: Обновить состояние приложения (например, добавить бустер пользователю)
          } else {
            alert("Оплата не завершена. Статус: " + status);
          }
        });
      } else {
        alert("Telegram WebApp SDK недоступен.  Пожалуйста, откройте приложение в Telegram.");
      }


    } catch (e) {
      let errorMessageText = "Произошла ошибка: " + e.message;

      // Добавляем больше информации, если она доступна
      if (e.response && e.response.status) {
        errorMessageText += ` (HTTP ${e.response.status})`;
      }

      alert(errorMessageText);
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