import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';

const root = createRoot(document.getElementById('root'));
root.render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
  </TonConnectUIProvider>
);