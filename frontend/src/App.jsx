import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import Wallet from './Pages/Wallet/Wallet.jsx';
import Loader from './Pages/Loader/Loader.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';

// Реализация функций для работы с cookie
const setCookie = (name, value, options = {}) => {
  let cookieStr = `${name}=${value}; Path=/;`;
  if (options.expires) {
    cookieStr += ` Expires=${options.expires.toUTCString()};`;
  }
  if (options.secure) {
    cookieStr += ' Secure;';
  }
  if (options.sameSite) {
    cookieStr += ` SameSite=${options.sameSite};`;
  }
  document.cookie = cookieStr;
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; Path=/;`;
};

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Авторизация через Telegram WebApp
  const authenticateWithTelegram = async () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const initData = window.Telegram.WebApp.initData;
      if (initData) {
        try {
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData }),
            credentials: 'include',
          });
          const result = await response.json();
          if (response.ok && result.success) {
            const token = result.token;
            if (token) {
              setCookie('auth_token', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), sameSite: 'Strict' });
              setIsAuthenticated(true);
            }
            console.log('Авторизация прошла успешно');
          } else {
            setIsAuthenticated(false);
            console.log('Ошибка авторизации');
          }
        } catch (err) {
          console.error('Ошибка при авторизации:', err);
        }
      }
    } else {
      checkAuthStatus();
    }
  };

  const checkAuthStatus = async () => {
    const token = getCookie('auth_token');
    if (token) {
      try {
        const response = await fetch('/api/auth/protected', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Ошибка проверки авторизации:', err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      if (window.Telegram.WebApp.isActive) {
        window.Telegram.WebApp.requestFullscreen();
        window.Telegram.WebApp.isVerticalSwipesEnabled = false;
      }
      authenticateWithTelegram();

      // Обработчик события popupClosed
      const handlePopupClosed = () => {
        deleteCookie('auth_token');
        setIsAuthenticated(false);
      };

      // Обработчик для кнопки BackButton
      const handleBackButton = () => {
        deleteCookie('auth_token');
        setIsAuthenticated(false);
      };

      window.Telegram.WebApp.onEvent('popupClosed', handlePopupClosed);
      window.Telegram.WebApp.onEvent('backButtonClicked', handleBackButton); // или 'backButton', в зависимости от API

      // Очистка при размонтировании компонента
      return () => {
        window.Telegram.WebApp.offEvent('popupClosed', handlePopupClosed);
        window.Telegram.WebApp.offEvent('backButtonClicked', handleBackButton);
      };
    } else {
      checkAuthStatus();
    }

  }, []);

  useEffect(() => {
    // Проверяем, находится ли пользователь на одной из страниц, где нужно отключить прокрутку
    if (location.pathname === '/' || location.pathname === '/friends' || location.pathname === '/tasks' || location.pathname === '/wallet') {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Убираем класс no-scroll при размонтировании компонента
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Убираем загрузку через 4 секунды
    }, 4000); // Время загрузки в миллисекундах

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setIsActive(window.Telegram.WebApp.isActive);
      if (window.Telegram.WebApp.isActive) {
        window.Telegram.WebApp.requestFullscreen();
        window.Telegram.WebApp.isVerticalSwipesEnabled = false;
      }
    }
  }, [location]);

  const handleLogout = () => {
    deleteCookie('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <>
      {loading && <Loader />}
      {/* Ваша кнопка выхода убрана, так как обработчик реализован через событие */}
      <PageTransition location={location}>
        <Routes>
          <Route path="/" element={<HomePage isActive={isActive} isAuth={isAuthenticated} />} />
          <Route path="/friends" element={<Friends isActive={isActive} />} />
          <Route path="/tasks" element={<Tasks isActive={isActive} />} />
          <Route path="/boost" element={<Boosters isActive={isActive} />} />
          <Route path="/wallet" element={<Wallet isActive={isActive} />} />
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
