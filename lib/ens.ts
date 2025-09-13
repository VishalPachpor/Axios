"use client";

import { createPublicClient, http, type Address } from "viem";
import { mainnet } from "viem/chains";

// Public RPC suitable for light read-only ENS lookups
const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http("https://cloudflare-eth.com"),
});

export function isEthereumAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function resolveEnsName(address: string): Promise<string | null> {
  if (!isEthereumAddress(address)) return null;
  try {
    const name = await ethereumClient.getEnsName({
      address: address as Address,
    });
    return name || null;
  } catch {
    return null;
  }
}

export async function resolveEnsAvatar(
  ensName: string
): Promise<string | null> {
  try {
    const avatar = await ethereumClient.getEnsAvatar({ name: ensName });
    return avatar || null;
  } catch {
    return null;
  }
}
