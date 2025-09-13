import type { CreateConnectorFn } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export function generateETHConnectors(
  appName: string
): Array<CreateConnectorFn> {
  const connectors: Array<CreateConnectorFn> = [
    injected(),
    coinbaseWallet({ appName, headlessMode: true }),
  ];

  if (process.env.NEXT_PUBLIC_WC_PROJECT_ID) {
    connectors.push(
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
        showQrModal: false,
      })
    );
  }
  return connectors;
}
