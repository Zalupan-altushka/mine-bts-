import { useEffect, useState } from 'react';

function useTelegram() {
  const [tg, setTg] = useState(window.Telegram.WebApp);

  useEffect(() => {
    // WebApp может быть недоступен сразу после загрузки страницы
    if (!tg) {
      setTg(window.Telegram.WebApp);
    }
  }, []);

  return {
    tg,
    user: tg.initDataUnsafe?.user,
    queryId: tg.initDataUnsafe?.query_id,
  };
}

export default useTelegram;