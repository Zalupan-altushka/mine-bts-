import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Boosters from './Pages/Boosters/Boosters.jsx';
import PageTransition from './Pages/Transition/PageTransition.jsx';
import Loader from './Pages/Loader/Loader.jsx';

const AUTH_FUNCTION_URL = 'https://ah-user.netlify.app/.netlify/functions/auth';

const App = () => {
    const location = useLocation();

    const [isActive, setIsActive] = useState(false);
    const [userData, setUserData] = useState(null);
    const [authCheckLoading, setAuthCheckLoading] = useState(true);
    const [telegramReady, setTelegramReady] = useState(false);

    useEffect(() => {
        console.log("App.jsx: useEffect triggered");

        // Telegram WebApp initialization and closing confirmation handling
        if (typeof window.Telegram !== 'undefined' && typeof window.Telegram.WebApp !== 'undefined') {
            try {
                window.Telegram.WebApp.enableClosingConfirmation();
                console.log("Telegram WebApp initialized");
                setTelegramReady(true);
            } catch (error) {
                console.error("App.jsx: Error initializing Telegram WebApp:", error);
                setTelegramReady(false); // Инициализация не удалась
            }
        } else {
            console.warn("Telegram WebApp not found");
            setTelegramReady(false); // Telegram WebApp API не найден
        }

        // Cleanup function for component unmount
        return () => {
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

        // Cleanup function on route change
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [location.pathname]);

 //   useEffect(() => {
        // Check Telegram WebApp activity and request fullscreen
 //     if (window.Telegram && window.Telegram.WebApp) {
 //          setIsActive(window.Telegram.WebApp.isActive);
 //          if (window.Telegram.WebApp.isActive) {
 //               window.Telegram.WebApp.requestFullscreen();
 ///               window.Telegram.WebApp.isVerticalSwipesEnabled = false; // Disable vertical swipes
 //           }
 //       }
 //   }, []);

    useEffect(() => {
        // Authenticate user with Telegram initData
        if (telegramReady) {
            console.log("App.jsx: Auth useEffect triggered");

            // Get initData right before sending the request
            const initData = window.Telegram?.WebApp?.initData || '';
            console.log("App.jsx: initData:", initData);

            const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe || {};
            console.log("App.jsx: initDataUnsafe:", initDataUnsafe);

            console.log("App.jsx: AUTH_FUNCTION_URL:", AUTH_FUNCTION_URL);

            if (initData) {
                console.log("App.jsx: initData exists, sending request");

                // Log initData just before sending the request
                console.log("App.jsx: Sending initData:", initData);


                fetch(AUTH_FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ initData }),
                })
                    .then(response => {
                        console.log("App.jsx: Response status:", response.status);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("App.jsx: Auth data:", data);
                        if (data.isValid) {
                            console.log("App.jsx: Авторизация прошла успешно!");
                            setUserData(data.userData);
                            // Задержка перед скрытием Loader
                            setTimeout(() => {
                                setAuthCheckLoading(false);
                            }, 2000);
                        } else {
                            console.error("App.jsx: Ошибка авторизации: Недействительные данные Telegram.");
                            setUserData(null);
                            setAuthCheckLoading(false); // Скрываем Loader сразу
                        }
                    })
                    .catch(error => {
                        console.error("App.jsx: Ошибка при запросе к Netlify Function:", error);
                        setUserData(null);
                        setAuthCheckLoading(false); // Скрываем Loader сразу
                    })
                    .finally(() => {
                        console.log("App.jsx: Auth check complete");
                    });
            } else {
                console.warn("App.jsx: Нет данных инициализации Telegram.");
                setAuthCheckLoading(false);
            }
        } else {
            console.log("App.jsx: Telegram WebApp not ready yet, skipping auth");
        }
    }, [telegramReady]);

    const updateUserData = async () => {
        try {
            const initData = window.Telegram?.WebApp?.initData || '';
            const response = await axios.post(AUTH_FUNCTION_URL, { initData });
            setUserData(response.data.userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <>
            {authCheckLoading ? (
                <Loader success={userData !== null} />
            ) : (
                <PageTransition location={location}>
                    <Routes location={location}>
                        <Route path="/" element={<HomePage isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
                        <Route path="/friends" element={<Friends isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
                        <Route path="/tasks" element={<Tasks isActive={isActive} userData={userData} />} />
                        <Route path="/boost" element={<Boosters isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
                    </Routes>
                </PageTransition>
            )}
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