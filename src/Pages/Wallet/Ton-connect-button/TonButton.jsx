import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import './button.css'

function TonButton() {
  
  return(
    <TonConnectUIProvider manifestUrl="https://tonconnect-manifest.json">
      <TonConnectButton style={{marginBottom: '20px'}} />
    </TonConnectUIProvider>
  );
}

export default TonButton;