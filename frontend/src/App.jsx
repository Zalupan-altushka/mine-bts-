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

  // Инициализация initDataRaw при загрузке
  useEffect(() => {
    if (window.TelegramWebApp) {
      const data = window.TelegramWebApp.initData;
      if (data) {
        setInitDataRaw(data);
      }
    }
  }, []);

  // Авторизация по initDataRaw
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
          } else {
            console.error('Авторизация не удалась, ошибка:', data.error);
          }
        })
        .catch((err) => {
          console.error('Ошибка при запросе авторизации:', err);
        });
    }
  }, [initDataRaw]);

  // Обработка активации WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      // Устанавливаем isActive при загрузке
      setIsActive(window.Telegram.WebApp.isActive);
      
      // Обновляем isActive при изменении
      const handleActiveChange = () => {
        setIsActive(window.Telegram.WebApp.isActive);
      };

      // Можно слушать событие, если есть
      window.Telegram.WebApp.onEvent('web_app_active', handleActiveChange);
      
      // Инициируем полноэкранный режим
      if (window.Telegram.WebApp.isActive) {
        window.Telegram.WebApp.requestFullscreen();
        // Можно отключить вертикальные свайпы, если нужно
        // window.Telegram.WebApp.isVerticalSwipesEnabled = false;
      }

      // Очистка слушателя при размонтировании
      return () => {
        window.Telegram.WebApp.offEvent('web_app_active', handleActiveChange);
      };
    }
  }, []);

  // Вызов API при каждом изменении isActive
 useEffect(() => {
    if (isActive && window.TelegramWebApp) {
      const data = window.TelegramWebApp.initData;
      if (data) {
        console.log('WebApp активен, вызываем API, initData:', data);
        fetch('/.netlify/functions/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache', // отключение кэширования
          },
          body: JSON.stringify({ initDataRaw: data }),
        })
        .then((res) => res.json())
        .then((data) => {
          console.log('Ответ сервера:', data);
          if (data.status === 'ok') {
            setUserData(data.userData);
            setIsAuthorized(true);
          } else {
            console.error('Авторизация не удалась, ошибка:', data.error);
          }
        })
        .catch((err) => {
          console.error('Ошибка при запросе:', err);
        });
      }
    }
  }, [isActive]);

  // Остальной код
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
    // Проверка маршрута для добавления/удаления класса
    if (['/', '/friends', '/tasks', '/boost'].includes(location.pathname)) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <PageTransition location={location}>
        <Routes>
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