import React, { useState, useEffect } from 'react';
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';

export function TonConnect() {
    const [address, setAddress] = useState('');
    const { account } = useTonConnectUI();

    useEffect(() => {
        if (account) {
            setAddress(account.address.slice(0, 6) + '...' + account.address.slice(-6));
        } else {
            setAddress('');
        }
    }, [account]);

    return (
        <TonConnectUIProvider manifestUrl="https://bts-best-app.netlify.app/tonconnect-manifest.json">
            <TonConnectButton style={{ height: '40px', width: '150px'}}>{address ? address : 'Connect Wallet'}</TonConnectButton>
        </TonConnectUIProvider>
    );
}

export default TonConnect;