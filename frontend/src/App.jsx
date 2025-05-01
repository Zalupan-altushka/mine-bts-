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

  // Функция для возврата на передний план
  const returnToWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      // Проверяем, свернуто ли приложение
      if (!window.Telegram.WebApp.isExpanded) {
        // Расширяем WebApp, чтобы вернуть его на передний план
        window.Telegram.WebApp.expand();
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
        returnToWebApp();
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
  }, [location.pathname]);

  useEffect(() => {
    // Проверка активности мини-приложения
    if (window.Telegram && window.Telegram.WebApp) {
      setIsActive(window.Telegram.WebApp.isActive);
      if (window.Telegram.WebApp.isActive) {
        window.Telegram.WebApp.requestFullscreen();
        window.Telegram.WebApp.expand(); // Расширяем при активации
        window.Telegram.WebApp.isVerticalSwipesEnabled = false; // или true по необходимости
      }
    }
  }, []);

  // Обработчик для кнопок или событий, вызывающий возврат
  const handleUserInteraction = () => {
    returnToWebApp();
    // Можно добавить сюда логику открытия нужных страниц
  };

  return (
    <>
      {loading && <Loader />}
      <PageTransition location={location}>
        {/* Например, добавим обработчик к кнопкам внутри страниц */}
        {/* Или вызывайте handleUserInteraction() при клике на кнопки */}
        <Routes location={location}>
          <Route path="/" element={<HomePage isActive={isActive} onInteraction={handleUserInteraction} />} />
          <Route path="/friends" element={<Friends isActive={isActive} onInteraction={handleUserInteraction} />} />
          <Route path="/tasks" element={<Tasks isActive={isActive} onInteraction={handleUserInteraction} />} />
          <Route path="/boost" element={<Boosters isActive={isActive} onInteraction={handleUserInteraction} />} />
        </Routes>
      </PageTransition>
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
