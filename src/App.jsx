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
  const [isActive, setIsActive] = useState(false); // Состояние для активности мини-приложения

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
    // Проверяем, активно ли мини-приложение
    if (window.Telegram && window.Telegram.WebApp) {
      setIsActive(window.Telegram.WebApp.isActive); // Устанавливаем состояние активности

      // Запрашиваем полноэкранный режим, если мини-приложение активно
      if (window.Telegram.WebApp.isActive) {
        window.Telegram.WebApp.requestFullscreen();
        // Включаем или отключаем вертикальные свайпы
        window.Telegram.WebApp.isVerticalSwipesEnabled = false; // Установите в true или false по вашему усмотрению
      }
    }
  }, []);

  return (
    <>
      {loading && <Loader />} {/* Показываем загрузчик, пока loading true */}
      <PageTransition location={location}>
        <Routes location={location}>
          <Route path="/" element={<HomePage isActive={isActive} />} />
          <Route path="/friends" element={<Friends isActive={isActive} />} />
          <Route path="/tasks" element={<Tasks isActive={isActive} />} />
          <Route path="/boost" element={<Boosters isActive={isActive} />} />
          <Route path="/wallet" element={<Wallet isActive={isActive} />} />
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