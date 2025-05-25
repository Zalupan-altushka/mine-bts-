import { useEffect, useState } from 'react';
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
        const initData = window.Telegram?.WebApp?.initData || '';
        const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe || {};

        console.log("App.jsx: initData:", initData); // Add this line

        if (initData) {


            fetch(AUTH_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initData }),
            })
                .then(response => {
                    console.log("Response status:", response.status); // Log response status
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Auth data:", data); // Log auth data

                    if (data.isValid) {
                        console.log("Авторизация прошла успешно!");
                        setUserData(data.userData); // Store the complete user data from Supabase
                    } else {
                        console.error("Ошибка авторизации: Недействительные данные Telegram.");
                        setUserData(null); // Сбрасываем userData в случае ошибки
                    }
                })
                .catch(error => {
                    console.error("Ошибка при запросе к Netlify Function:", error);
                    setUserData(null); // Сбрасываем userData в случае ошибки
                })
                .finally(() => {
                    setAuthCheckLoading(false);
                });
        } else {
            console.warn("Нет данных инициализации Telegram.");
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