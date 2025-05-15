import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';
import Loader from './Pages/Loader/Loader.jsx';

const App = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [initDataRaw, setInitDataRaw] = useState(null);

  // Обновление initDataRaw при каждом фокусе Web App
  useEffect(() => {
    const handleFocus = () => {
      if (window.TelegramWebApp) {
        const data = window.TelegramWebApp.initData;
        if (data) {
          setInitDataRaw(data);
        }
      }
    };

    // Подписка на событие 'focus'
    if (window.TelegramWebApp) {
      window.TelegramWebApp.onEvent('focus', handleFocus);
    }

    // Изначально вызываем
    handleFocus();

    // Очистка
    return () => {
      if (window.TelegramWebApp) {
        window.TelegramWebApp.offEvent('focus', handleFocus);
      }
    };
  }, []);

  // Отправка initDataRaw на сервер для проверки и авторизации
  useEffect(() => {
    if (initDataRaw) {
      fetch('/.netlify/functions/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initDataRaw }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'ok') {
            // Сохраняем полные данные пользователя
            setUserData(data.userData);
            setIsAuthorized(true);
          } else {
            console.error('Авторизация не удалась, ошибка:', data.error);
          }
        })
        .catch((err) => {
          console.error('Ошибка при запросе авторизации:', err);
        });
    }
  }, [initDataRaw]);

  useEffect(() => {
    // Установка подтверждения закрытия
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.enableClosingConfirmation();
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
    if (
      location.pathname === '/' ||
      location.pathname === '/friends' ||
      location.pathname === '/tasks' ||
      location.pathname === '/boost'
    ) {
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


