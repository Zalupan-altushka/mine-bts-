import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';
import Loader from './Pages/Loader/Loader.jsx'; // Импортируем Loader
import Wallet from './Pages/Wallet/Wallet.jsx';

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Убираем загрузку через 4 секунды
    }, 4000); // Установите время загрузки в миллисекундах

    return () => clearTimeout(timer);
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
    // Check if the Telegram Web App is active and request full-screen mode
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.isActive) {
      window.Telegram.WebApp.requestFullscreen();
      // Включаем или отключаем вертикальные свайпы
      window.Telegram.WebApp.isVerticalSwipesEnabled = false; // Установите в true или false по вашему усмотрению

      // Extract user data from initData
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        const userData = {
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
        };

        // Send user data to the server
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then(response => response.json())
          .then(data => {
            console.log('User data sent successfully:', data);
          })
          .catch(error => {
            console.error('Error sending user data:', error);
          });
      }
    }
  }, []);

  return (
    <>
      {loading && <Loader />} {/* Показываем загрузчик, пока loading true */}
      <PageTransition location={location}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/boost" element={<Boosters />} />
          <Route path="/wallet" element={<Wallet />} />
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
