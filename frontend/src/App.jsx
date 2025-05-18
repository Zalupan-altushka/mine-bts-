import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'; // импорт SDK
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
  const [userData, setUserData] = useState(null); // для хранения данных пользователя

  // Получение launch params через SDK
  useEffect(() => {
    const { initDataRaw, initData } = retrieveLaunchParams();

    if (initDataRaw) {
      // Отправляем initDataRaw на сервер для валидации
      fetch('https://ah-user.netlify.app/.netlify/functions/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initDataRaw }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'ok' && data.userData) {
            setUserData(data.userData);
          } else {
            console.warn('Авторизация не удалась или данные отсутствуют');
          }
        })
        .catch((err) => {
          console.error('Ошибка при отправке auth-запроса:', err);
        });
    }
  }, []);

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
          <Route
            path="/"
            element={<HomePage isActive={isActive} userData={userData} />}
          />
          <Route
            path="/friends"
            element={<Friends isActive={isActive} userData={userData} />}
          />
          <Route
            path="/tasks"
            element={<Tasks isActive={isActive} userData={userData} />}
          />
          <Route
            path="/boost"
            element={<Boosters isActive={isActive} userData={userData} />}
          />
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


