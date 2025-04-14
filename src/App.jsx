import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';
import Loader from './Pages/Loader/Loader.jsx'; // Импортируем Loader
import Wallet from './Pages/Wallet/Wallet.jsx';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
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
    if (location.pathname === '/' || location.pathname === '/friends' || location.pathname === '/tasks' || location.pathname === '/wallet' ) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    
    // Убираем класс no-scroll при размонтировании компонента
    return () => {
      document.body.classList.remove('no-scroll');
    };
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
}

export default App;