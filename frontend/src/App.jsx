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
  const [isActive, setIsActive] = useState(false); // Состояние для активности мини-приложения

  // Обработчики событий для отслеживания активации/деактивации WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;

      const handleActivated = () => {
        setIsActive(true);
      };

      const handleDeactivated = () => {
        setIsActive(false);
      };

      webApp.onEvent('activated', handleActivated);
      webApp.onEvent('deactivated', handleDeactivated);

      // Инициализация текущего состояния
      setIsActive(webApp.isActive);

      return () => {
        webApp.offEvent('activated', handleActivated);
        webApp.offEvent('deactivated', handleDeactivated);
      };
    }
  }, []);

  const handleReturnToWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      if (!webApp.isActive) {
        // Если свернуто, активируем WebApp
        webApp.expand(); // Расширяет WebApp
        // Можно также вызвать webApp.ready(), если нужно
      }
    }
  };

  // Обработка кнопок или любых действий, вызывающих открытие WebApp
  const handleOpenWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      if (!window.Telegram.WebApp.isActive) {
        // Если свернуто, возвращаемся
        handleReturnToWebApp();
      } else {
        // WebApp уже активен, ничего не делаем или можно обновить
      }
    }
  };

  useEffect(() => {
    // Получаем raw-данные инициализации Telegram
    const initDataRaw = retrieveRawInitData();

    // Отправляем их на сервер
    fetch('https://example.com/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `tma ${initDataRaw}`,
      },
    }).then((response) => {
      // Обработка ответа, если нужно
    }).catch((error) => {
      console.error('Ошибка при отправке init-данных:', error);
    });

    // Установка подтверждения закрытия
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.enableClosingConfirmation();

      // Проверка активности
      setIsActive(window.Telegram.WebApp.isActive);

      // Если WebApp уже активен, сразу расширяем или возвращаемся
      if (window.Telegram.WebApp.isActive) {
        handleReturnToWebApp();
      }
    }

    // Таймаут для загрузки
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      // Отключаем подтверждение закрытия при размонтировании
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.disableClosingConfirmation();
      }
    };
  }, []);

  useEffect(() => {
    // Проверка текущего маршрута
    if (['/', '/friends', '/tasks', '/boost'].includes(location.pathname)) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [location.pathname]);

  useEffect(() => {
    // Проверка активности мини-приложения
    if (window.Telegram && window.Telegram.WebApp) {
      setIsActive(window.Telegram.WebApp.isActive);
      if (window.Telegram.WebApp.isActive) {
        window.Telegram.WebApp.requestFullscreen();
        window.Telegram.WebApp.isVerticalSwipesEnabled = false; // или true по необходимости
      }
    }
  }, []);

  return (
    <>
      {loading && <Loader />}
      <PageTransition location={location}>
        <Routes location={location}>
          <Route path="/" element={<HomePage isActive={isActive} />} />
          <Route path="/friends" element={<Friends isActive={isActive} />} />
          <Route path="/tasks" element={<Tasks isActive={isActive} />} />
          <Route path="/boost" element={<Boosters isActive={isActive} />} />
        </Routes>
      </PageTransition>
      {/* Пример кнопки, которая вызывает открытие WebApp */}
      <button onClick={handleOpenWebApp}>Открыть WebApp</button>
    </>
  );
};

const Main = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default Main;
