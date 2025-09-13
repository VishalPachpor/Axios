"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  useConnectUI,
  useDisconnect,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { resolveEnsName } from "@/lib/ens";

export default function WalletAction() {
  const { connect, isConnecting, error, isError } = useConnectUI();
  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();

  // Memoize connection state to prevent unnecessary re-renders
  const connectionState = useMemo(
    () => ({
      isConnected: isConnected && !!wallet,
      address: wallet?.address?.toString() || "",
    }),
    [isConnected, wallet]
  );

  const [ensName, setEnsName] = useState<string | null>(null);

  // Try to resolve ENS name when address changes (best-effort)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!connectionState.address) {
        setEnsName(null);
        return;
      }
      const name = await resolveEnsName(connectionState.address);
      if (!cancelled) setEnsName(name);
    })();
    return () => {
      cancelled = true;
    };
  }, [connectionState.address]);

  // Handle connection errors
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet.",
        variant: "destructive",
      });
    }
  }, [isError, error]);

  const shortenAddress = useCallback(
    (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`,
    []
  );

  const handleClick = useCallback(async () => {
    try {
      if (connectionState.isConnected) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect wallet.";
      toast({
        title: "Connection Error",
        description: message,
        variant: "destructive",
      });
    }
  }, [connectionState.isConnected, connect, disconnect]);

  // Show loading state only when actually connecting
  if (isConnecting) {
    return (
      <Button type="button" disabled className="h-10 px-4">
        Connecting...
      </Button>
    );
  }

  const label = connectionState.isConnected
    ? ensName || shortenAddress(connectionState.address)
    : "Connect wallet";

  return (
    <Button type="button" onClick={handleClick} className="h-10 px-4">
      {label}
    </Button>
  );
}
