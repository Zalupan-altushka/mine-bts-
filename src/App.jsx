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
    }
  }, []);

  useEffect(() => {
    // Убедитесь, что мини-приложение готово
    if (window.Telegram && window.Telegram.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton;
      backButton.show();

      // Функция для изменения текста кнопки "Назад"
      const updateBackButtonText = () => {
        switch (location.pathname) {
          case '/':
            backButton.setText("Back");
            break;
          case '/friends':
            backButton.setText("Back");
            break;
          case '/tasks':
            backButton.setText("Back");
            break;
          case '/boost':
            backButton.setText("Back");
            break;
          case '/wallet':
            backButton.setText("Back");
            break;
          default:
            backButton.setText("Close");
        }
      };

      updateBackButtonText();

      // Устанавливаем обработчик события нажатия на кнопку "Назад"
      backButton.onClick(() => {
        window.history.back(); // Возврат на предыдущую страницу
      });

      // Убираем обработчик при размонтировании
      return () => {
        backButton.offClick();
      };
    }
  }, [location.pathname]);

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