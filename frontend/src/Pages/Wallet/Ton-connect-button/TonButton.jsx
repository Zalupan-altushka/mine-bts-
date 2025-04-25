import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TonConnectButton } from '@tonconnect/ui-react';

function TonButton() {
  
  return(
    <TonConnectUIProvider manifestUrl="https://tonconnect-manifest.json">
      <TonConnectButton />
    </TonConnectUIProvider>
  );
}

export default TonButton;