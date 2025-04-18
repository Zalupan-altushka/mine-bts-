import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';
import Loader from './Pages/Loader/Loader.jsx';
import Wallet from './Pages/Wallet/Wallet.jsx';
import DayCheck from './Pages/Home/Containers/Day/DayCheck'; // импортируем DayCheck

const App = () => {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (['/', '/friends', '/tasks', '/wallet'].includes(location.pathname)) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [location.pathname]);

  React.useEffect(() => {
    if (window.Telegram?.WebApp?.isActive) {
      window.Telegram.WebApp.requestFullscreen();
      window.Telegram.WebApp.isVerticalSwipesEnabled = false;

      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
          }),
        }).then(res => res.json()).then(console.log).catch(console.error);
      }
    }
  }, []);

  return (
    <>
      {loading && <Loader />}
      {/* Вынесите DayCheck сюда, вне Routes */}
      <DayCheck />
      <PageTransition location={location}>
        <Routes>
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

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;
