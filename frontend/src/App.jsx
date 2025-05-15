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

  // Функция для проверки и установки initDataRaw
  const checkAndSetInitData = () => {
    if (window.TelegramWebApp) {
      const data = window.TelegramWebApp.initData;
      if (data && data !== initDataRaw) {
        setInitDataRaw(data);
      }
    }
  };

  // Проверка initData при монтировании и по таймауту
  useEffect(() => {
    checkAndSetInitData();

    // Можно добавить интервал для периодической проверки
    const interval = setInterval(() => {
      checkAndSetInitData();
    }, 60000); // каждые 60 секунд

    return () => clearInterval(interval);
  }, [initDataRaw]);

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
            setUserData(data.userData);
            setIsAuthorized(true);
            console.log('Пользователь авторизован:', data.userData);
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
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.disableClosingConfirmation();
      }
    };
  }, []);

  useEffect(() => {
    // Проверка маршрута
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
    // Проверка активности
    if (window.Telegram && window.Telegram.WebApp) {
      setIsActive(window.Telegram.WebApp.isActive);
      if (window.Telegram.WebApp.isActive) {
        window.Telegram.WebApp.requestFullscreen();
        window.Telegram.WebApp.isVerticalSwipesEnabled = false;
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
