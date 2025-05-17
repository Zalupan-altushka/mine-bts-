// app.jsx
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
  const [initData, setInitData] = useState(null);

  // Проверка и установка initData
  const tg = window.Telegram?.WebApp;

  const checkAndSetInitData = () => {
    if (tg && tg.initData) {
      if (tg.initData !== initData) {
        setInitData(tg.initData);
      }
    }
  };

  // Проверка initData при монтировании и каждые 60 секунд
  useEffect(() => {
    checkAndSetInitData();

    const interval = setInterval(() => {
      checkAndSetInitData();
    }, 60000); // каждые 60 секунд

    return () => clearInterval(interval);
  }, [initData]);

  // Отправляем initDataRaw на сервер
  useEffect(() => {
    if (initData) {
      console.log('Отправляю initDataRaw на сервер:', initData);
      fetch('/.netlify/functions/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initDataRaw: initData }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setUserData(data.userData);
          setIsAuthorized(true);
          console.log('Пользователь авторизован:', data.userData);
        } else {
          console.error('Ошибка авторизации:', data);
        }
      })
      .catch((err) => {
        console.error('Ошибка fetch:', err);
      });
    }
  }, [initData]);

  useEffect(() => {
    // Включение подтверждения закрытия
    if (tg) {
      tg.enableClosingConfirmation();
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (tg) {
        tg.disableClosingConfirmation();
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
  }, [location.pathname]);

  useEffect(() => {
    // Проверка активности
    if (tg) {
      setIsActive(tg.isActive);
      if (tg.isActive) {
        tg.requestFullscreen();
        tg.isVerticalSwipesEnabled = false;
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

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;