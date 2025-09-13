"use client";

import { createConfig, defaultConnectors } from "@fuels/connectors";
import { FuelProvider } from "@fuels/react";
import { CHAIN_IDS, Provider } from "fuels";
import { useMemo } from "react";

const NETWORKS = [
  {
    chainId: CHAIN_IDS.fuel.testnet,
    url: "https://testnet.fuel.network/v1/graphql",
  },
];

export const FuelProviders = ({ children }: { children: React.ReactNode }) => {
  // Memoize the config to prevent recreation on every render
  const FUEL_CONFIG = useMemo(() => {
    return createConfig(() => {
      return {
        connectors: defaultConnectors({
          devMode: true,
          chainId: NETWORKS[0].chainId,
          fuelProvider: new Provider(NETWORKS[0].url),
        }),
        // Optimize for faster connection
        autoConnect: true,
        reconnectOnMount: false,
        // Add connection timeout
        connectionTimeout: 10000, // 10 seconds
      };
    });
  }, []);

  return (
    <FuelProvider theme="light" fuelConfig={FUEL_CONFIG} networks={NETWORKS}>
      {children}
    </FuelProvider>
  );
};
