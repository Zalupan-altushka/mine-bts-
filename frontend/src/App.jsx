// App.jsx
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
    const [isActive, setIsActive] = useState(false);
    const [userData, setUserData] = useState(null);
    const [authCheckLoading, setAuthCheckLoading] = useState(true);
    const [telegramReady, setTelegramReady] = useState(false);

    useEffect(() => {
        if (typeof window.Telegram !== 'undefined' && typeof window.Telegram.WebApp !== 'undefined') {
            try {
                window.Telegram.WebApp.enableClosingConfirmation();
                console.log("App.jsx: Telegram WebApp initialized");
                setTelegramReady(true);
            } catch (error) {
                console.error("App.jsx: Error initializing Telegram WebApp:", error);
                setTelegramReady(false);
            }
        } else {
            console.warn("App.jsx: Telegram WebApp not found");
            setTelegramReady(false);
        }

        return () => {
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.disableClosingConfirmation();
            }
        };
    }, []);

    useEffect(() => {
        if (['/', '/friends', '/tasks', '/boost'].includes(location.pathname)) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [location.pathname]);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setIsActive(window.Telegram.WebApp.isActive);
            if (window.Telegram.WebApp.isActive) {
                window.Telegram.WebApp.requestFullscreen();
                window.Telegram.WebApp.isVerticalSwipesEnabled = false;
            }
        }
    }, []);

    useEffect(() => {
        if (telegramReady) {
            console.log("App.jsx: Auth useEffect triggered");

            let initData = window.Telegram?.WebApp?.initData || '';
            console.log("App.jsx: Initial initData:", initData);

            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');
            if (refCode) {
                console.log("App.jsx: Referral code from URL:", refCode);
                initData += `&ref=${refCode}`; // Append ref code to initData
                console.log("App.jsx: Modified initData with ref:", initData); // Add this line
            }

            if (initData) {
                console.log("App.jsx: initData exists, sending request");

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
                        setTimeout(() => {
                            setAuthCheckLoading(false);
                        }, 2000);
                    } else {
                        console.error("App.jsx: Ошибка авторизации: Недействительные данные Telegram.");
                        setUserData(null);
                        setAuthCheckLoading(false);
                    }
                })
                .catch(error => {
                    console.error("App.jsx: Ошибка при запросе к Netlify Function:", error);
                    setUserData(null);
                    setAuthCheckLoading(false);
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

    return (
        <>
            {authCheckLoading ? (
                <Loader success={userData !== null} />
            ) : (
                <PageTransition location={location}>
                    <Routes location={location}>
                        <Route path="/" element={<HomePage isActive={isActive} userData={userData} />} />
                        <Route path="/friends" element={<Friends isActive={isActive} userData={userData} />} />
                        <Route path="/tasks" element={<Tasks isActive={isActive} userData={userData} />} />
                        <Route path="/boost" element={<Boosters isActive={isActive} userData={userData} />} />
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