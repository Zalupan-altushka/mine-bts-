import { useEffect } from 'react';

const useTelegramExpand = () => {
    useEffect(() => {
        const tg = window.Telegram.WebApp;
        if (tg) {
            tg.expand(); 
        }
    }, []);
};

export default useTelegramExpand;