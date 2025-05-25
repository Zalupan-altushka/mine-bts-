import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';
import Loader from './Pages/Loader/Loader.jsx';

const AUTH_FUNCTION_URL = 'https://ah-user.netlify.app/.netlify/functions/auth'; // Убедитесь, что URL правильный

const App = () => {
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [userData, setUserData] = useState(null);
    const [authCheckLoading, setAuthCheckLoading] = useState(true);

    useEffect(() => {
        console.log("App.jsx: useEffect triggered"); // Add this line

        // Telegram WebApp initialization and closing confirmation handling
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.enableClosingConfirmation();
            console.log("Telegram WebApp initialized");
        } else {
            console.warn("Telegram WebApp not found");
        }

        // Simulate initial loading with a timer
        const timer = setTimeout(() => {
            setLoading(false);
        }, 4000);

        // Cleanup function for component unmount
        return () => {
            clearTimeout(timer);
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.disableClosingConfirmation();
            }
        };
    }, []);

    useEffect(() => {
        // Prevent scrolling on specific routes
        if (['/', '/friends', '/tasks', '/boost'].includes(location.pathname)) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        // Cleanup on route change
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [location.pathname]);

    useEffect(() => {
        // Check Telegram WebApp activity and request fullscreen
        if (window.Telegram && window.Telegram.WebApp) {
            setIsActive(window.Telegram.WebApp.isActive);
            if (window.Telegram.WebApp.isActive) {
                window.Telegram.WebApp.requestFullscreen();
                window.Telegram.WebApp.isVerticalSwipesEnabled = false; // Disable vertical swipes
            }
        }
    }, []);

    useEffect(() => {
        // Authenticate user with Telegram initData
        console.log("App.jsx: Auth useEffect triggered"); // Добавлено логирование

        const initData = window.Telegram?.WebApp?.initData || '';
        console.log("App.jsx: initData:", initData); // Add this line

        const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe || {};
         console.log("App.jsx: initDataUnsafe:", initDataUnsafe); // Add this line

        console.log("App.jsx: AUTH_FUNCTION_URL:", AUTH_FUNCTION_URL); // Add this line

        if (initData) {
            console.log("App.jsx: initData exists, sending request");  // Добавлено логирование
            fetch(AUTH_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initData }),
            })
                .then(response => {
                    console.log("App.jsx: Response status:", response.status); // Log response status
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("App.jsx: Auth data:", data); // Log auth data

                    if (data.isValid) {
                        console.log("App.jsx: Авторизация прошла успешно!");
                        setUserData(data.userData); // Store the complete user data from Supabase
                    } else {
                        console.error("App.jsx: Ошибка авторизации: Недействительные данные Telegram.");
                        setUserData(null); // Сбрасываем userData в случае ошибки
                    }
                })
                .catch(error => {
                    console.error("App.jsx: Ошибка при запросе к Netlify Function:", error);
                    setUserData(null); // Сбрасываем userData в случае ошибки
                })
                .finally(() => {
                    console.log("App.jsx: Auth check complete"); // Добавлено логирование
                    setAuthCheckLoading(false);
                });
        } else {
            console.warn("App.jsx: Нет данных инициализации Telegram.");
            setAuthCheckLoading(false);
        }
    }, []);

    // Show loader while authenticating
    if (authCheckLoading) {
        return <Loader />;
    }

    return (
        <>
            {loading && <Loader />}
            <Routes location={location}>
                <Route
                    path="/"
                    element={
                        <PageTransition location={location}>
                            <HomePage isActive={isActive} userData={userData} />
                        </PageTransition>
                    }
                />
                <Route
                    path="/friends"
                    element={
                        <PageTransition location={location}>
                            <Friends isActive={isActive} userData={userData} />
                        </PageTransition>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <PageTransition location={location}>
                            <Tasks isActive={isActive} userData={userData} />
                        </PageTransition>
                    }
                />
                <Route
                    path="/boost"
                    element={
                        <PageTransition location={location}>
                            <Boosters isActive={isActive} userData={userData} />
                        </PageTransition>
                    }
                />
            </Routes>
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