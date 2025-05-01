import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { retrieveRawInitData } from '@telegram-apps/sdk-react'; // Импортируем функцию
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';
import Loader from './Pages/Loader/Loader.jsx';

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Функция для возврата на передний план
  const returnToWebApp = () => {
    if (window.Telegram?.WebApp) {
      // Если WebApp свернут или не расширен — расширяем
      if (!window.Telegram.WebApp.isExpanded) {
        window.Telegram.WebApp.expand();
      }
    }
  };

  useEffect(() => {
    // Получение initData
    const initDataRaw = retrieveRawInitData();

    // Отправка данных на сервер
    fetch('https://example.com/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `tma ${initDataRaw}`,
      },
    }).catch((error) => {
      console.error('Ошибка при отправке init-данных:', error);
    });

    // Включение подтверждения закрытия
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.enableClosingConfirmation();

      // Обработка события закрытия или свертывания
      const handleWebAppEvent = () => {
        returnToWebApp();
      };

      // Подписка на события
      window.Telegram.WebApp.onEvent('webappClose', handleWebAppEvent);
      window.Telegram.WebApp.onEvent('webappSwitch', handleWebAppEvent);
      window.Telegram.WebApp.onEvent('webappPinned', handleWebAppEvent);
      window.Telegram.WebApp.onEvent('webappUnpinned', handleWebAppEvent);

      // Если WebApp уже активен, расширяем его
      if (window.Telegram.WebApp.isActive) {
        returnToWebApp();
      }
    }

    // Таймаут для загрузки
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.offEvent('webappClose', handleWebAppEvent);
        window.Telegram.WebApp.offEvent('webappSwitch', handleWebAppEvent);
        window.Telegram.WebApp.offEvent('webappPinned', handleWebAppEvent);
        window.Telegram.WebApp.offEvent('webappUnpinned', handleWebAppEvent);
        window.Telegram.WebApp.disableClosingConfirmation();
      }
    };
  }, []);

  useEffect(() => {
    // Обработка маршрутов
    if (['/', '/friends', '/tasks', '/boost'].includes(location.pathname)) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <PageTransition location={location}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/boost" element={<Boosters />} />
        </Routes>
      </PageTransition>
    </>
  );
};

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;

