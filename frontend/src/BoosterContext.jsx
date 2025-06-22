// BoosterContext.js
import React, { createContext, useState, useEffect } from 'react';

export const BoosterContext = createContext();

export const BoosterProvider = ({ children, userData }) => {
  const [isPurchasedApps, setIsPurchasedApps] = useState(false);
  const [isPurchasedPrem, setIsPurchasedPrem] = useState(false);
  const [isPurchasedETH, setIsPurchasedETH] = useState(false);
  const [isPurchasedBTC, setIsPurchasedBTC] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsPurchasedApps(userData.apps_boost === true);
      setIsPurchasedPrem(userData.prem_boost === true);
      setIsPurchasedETH(userData.eth_boost === true);
      setIsPurchasedBTC(userData.btc_boost === true);
    }
  }, [userData]);

  return (
    <BoosterContext.Provider value={{
      isPurchasedApps, setIsPurchasedApps,
      isPurchasedPrem, setIsPurchasedPrem,
      isPurchasedETH, setIsPurchasedETH,
      isPurchasedBTC, setIsPurchasedBTC,
    }}>
      {children}
    </BoosterContext.Provider>
  );
};