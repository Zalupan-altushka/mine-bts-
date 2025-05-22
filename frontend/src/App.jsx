import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';
import Loader from './Pages/Loader/Loader.jsx';

const AUTH_FUNCTION_URL = 'https://ah-user.netlify.app/.netlify/functions/auth';

const App = () => {
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [userData, setUserData] = useState(null);
    const [authCheckLoading, setAuthCheckLoading] = useState(true);

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

    // useEffect(() => {
   //     // Проверка активности
   //     if (window.Telegram && window.Telegram.WebApp) {
   //         setIsActive(window.Telegram.WebApp.isActive);
   //         if (window.Telegram.WebApp.isActive) {
   //             window.Telegram.WebApp.requestFullscreen();
   //             window.Telegram.WebApp.isVerticalSwipesEnabled = false;
   //         }
   //     }
   // }, []);


    useEffect(() => {
        const initData = window.Telegram?.WebApp?.initData || '';
        const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe || {};

        if (initData) {
            // Отправляем данные на Netlify Function для проверки
            fetch(AUTH_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initData }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.isValid) {
                        console.log("Авторизация прошла успешно!");
                        setUserData(initDataUnsafe.user); // Сохраняем данные пользователя
                    } else {
                        console.error("Ошибка авторизации: Недействительные данные Telegram.");
                        // Обработка недействительной авторизации
                    }
                })
                .catch(error => {
                    console.error("Ошибка при запросе к Netlify Function:", error);
                    // Обработка ошибки запроса
                })
                .finally(() => {
                    setAuthCheckLoading(false);
                });
        } else {
            console.warn("Нет данных инициализации Telegram.");
            setAuthCheckLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userData) {
            console.log("Обновленные данные пользователя:", userData);
        }
    }, [userData]);

    if (authCheckLoading) {
        return <Loader />;
    }

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