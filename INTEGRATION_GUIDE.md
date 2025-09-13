# Axios DeFi Platform - Complete Integration Guide

## Overview

This guide provides step-by-step instructions for integrating real blockchain functionality into the Axios DeFi platform. The application currently uses dummy data and needs to be connected to smart contracts, wallet providers, and real network data.

## Current Architecture Analysis

### Frontend Structure

- **Framework**: Next.js 15.2.4 with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: React hooks (useState, useMemo)
- **Pages**: Home (`/`), Earn (`/earn`), Borrow (`/borrow`)

### Key Components Requiring Integration

1. **Header** (`components/header.tsx`) - Wallet connection & network switching
2. **EarnExplorer** (`components/earn-explorer.tsx`) - Pool, pair, and loan data
3. **BorrowExplorer** (`components/borrow-explorer.tsx`) - Borrowing interface
4. **LoanInterface** (`components/loan-interface.tsx`) - Loan calculations

### Current Dummy Data Locations

#### 1. Pool Data (`components/earn-explorer.tsx` lines 52-137)

```typescript
const POOLS: Pool[] = [
  {
    asset: "USDC",
    symbol: "USDC",
    name: "USD Coin",
    pair: "USDC/SPX",
    liquidity: "367.10K",
    debt: "110.49K",
    yield: 20.36,
    myDeposit: "0.00",
  },
  // ... more pools
];
```

#### 2. Pair Data (`components/earn-explorer.tsx` lines 140-189)

```typescript
const PAIRS: PairData[] = [
  {
    collateralToken: "PRIME",
    pair: "PRIME/USDC",
    liquidity: "$10001.23B",
    volume: "$14.13M",
    apy: 7.91,
  },
  // ... more pairs
];
```

#### 3. Loan Data (`components/earn-explorer.tsx` lines 192-238)

```typescript
const LOANS: LoanData[] = [
  {
    id: "#4139",
    collateral: "7.40 WETH",
    amount: "20.93M",
    apr: 29.5,
    duration: "30 days",
    status: "Active",
  },
  // ... more loans
];
```

#### 4. Token/Price Data (`components/borrow-explorer.tsx` & `components/loan-interface.tsx`)

```typescript
const TOKENS: Token[] = [
  { symbol: "WBTC", name: "WBTC", chain: "Ethereum", aprReward: 22 },
  // ... more tokens
];

const PRICES_USD: Record<string, number> = {
  eth: 4200,
  usdt: 1,
  btc: 119000,
  fuel: 0.007871,
};
```

## Phase 1: Project Setup & Dependencies

### Step 1.1: Install Web3 Dependencies

```bash
# Web3 wallet connection
pnpm add @web3modal/wagmi wagmi viem @web3modal/siwe

# Additional blockchain utilities
pnpm add @tanstack/react-query ethers@^6

# Environment configuration
pnpm add dotenv

# API client
pnpm add axios swr
```

### Step 1.2: Environment Configuration

Create `.env.local`:

```env
# Wallet Connect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Smart Contract Addresses
NEXT_PUBLIC_Axios_CORE_CONTRACT=0x...
NEXT_PUBLIC_Axios_POOL_FACTORY=0x...
NEXT_PUBLIC_Axios_ORACLE_CONTRACT=0x...

# RPC Endpoints
NEXT_PUBLIC_ETHEREUM_RPC=https://eth-mainnet.alchemyapi.io/v2/your-key
NEXT_PUBLIC_ARBITRUM_RPC=https://arb-mainnet.g.alchemy.com/v2/your-key
NEXT_PUBLIC_POLYGON_RPC=https://polygon-mainnet.g.alchemy.com/v2/your-key
NEXT_PUBLIC_BASE_RPC=https://base-mainnet.g.alchemy.com/v2/your-key

# API Endpoints
NEXT_PUBLIC_API_BASE_URL=https://api.Axios.com
```

**Commit Message**: `feat: add web3 dependencies and environment configuration`

---

## Phase 2: Core Infrastructure Setup

### Step 2.1: Create Web3 Configuration

Create `lib/web3-config.ts`:

```typescript
import { createConfig, http } from "wagmi";
import { mainnet, arbitrum, polygon, base } from "wagmi/chains";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

export const config = createConfig({
  chains: [mainnet, arbitrum, polygon, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    coinbaseWallet({
      appName: "Axios",
      appLogoUrl: "https://Axios.com/logo.png",
    }),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC),
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC),
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC),
  },
});

export const supportedChains = [mainnet, arbitrum, polygon, base];
```

### Step 2.2: Create Web3 Provider

Create `components/providers/web3-provider.tsx`:

```typescript
"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/web3-config";
import { createWeb3Modal } from "@web3modal/wagmi/react";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Step 2.3: Update Root Layout

Update `app/layout.tsx`:

```typescript
import { Web3Provider } from "@/components/providers/web3-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
```

**Commit Message**: `feat: implement web3 provider and wallet connection infrastructure`

---

## Phase 3: Smart Contract Integration

### Step 3.1: Create Contract ABIs

Create `lib/contracts/abis/` directory with contract ABIs:

`lib/contracts/abis/AxiosCore.json`
`lib/contracts/abis/AxiosPool.json`
`lib/contracts/abis/AxiosOracle.json`

### Step 3.2: Create Contract Hooks

Create `hooks/useContracts.ts`:

```typescript
import { useContract, useChainId } from "wagmi";
import AxiosCoreABI from "@/lib/contracts/abis/AxiosCore.json";
import AxiosPoolABI from "@/lib/contracts/abis/AxiosPool.json";

const CONTRACT_ADDRESSES = {
  1: {
    // Ethereum
    core: process.env.NEXT_PUBLIC_Axios_CORE_CONTRACT,
    poolFactory: process.env.NEXT_PUBLIC_Axios_POOL_FACTORY,
  },
  42161: {
    // Arbitrum
    core: process.env.NEXT_PUBLIC_Axios_CORE_CONTRACT_ARB,
    poolFactory: process.env.NEXT_PUBLIC_Axios_POOL_FACTORY_ARB,
  },
  // Add other chains...
};

export function useAxiosCore() {
  const chainId = useChainId();
  const address = CONTRACT_ADDRESSES[chainId]?.core;

  return useContract({
    address,
    abi: AxiosCoreABI,
  });
}

export function useAxiosPool(poolAddress: string) {
  return useContract({
    address: poolAddress,
    abi: AxiosPoolABI,
  });
}
```

**Commit Message**: `feat: add smart contract ABIs and contract interaction hooks`

---

## Phase 4: Data Layer Implementation

### Step 4.1: Create API Service Layer

Create `lib/api/index.ts`:

```typescript
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Pool API
export const poolsApi = {
  getAllPools: () => api.get("/pools"),
  getPoolById: (id: string) => api.get(`/pools/${id}`),
  getPoolMetrics: (id: string) => api.get(`/pools/${id}/metrics`),
  getUserDeposits: (address: string) => api.get(`/pools/user/${address}`),
};

// Pairs API
export const pairsApi = {
  getAllPairs: () => api.get("/pairs"),
  getPairById: (id: string) => api.get(`/pairs/${id}`),
  getPairVolume: (id: string, timeframe: string) =>
    api.get(`/pairs/${id}/volume?timeframe=${timeframe}`),
};

// Loans API
export const loansApi = {
  getUserLoans: (address: string) => api.get(`/loans/user/${address}`),
  getLoanById: (id: string) => api.get(`/loans/${id}`),
  createLoan: (data: any) => api.post("/loans", data),
  repayLoan: (id: string, data: any) => api.post(`/loans/${id}/repay`, data),
};

// Price API
export const priceApi = {
  getTokenPrices: (tokens: string[]) =>
    api.get(`/prices?tokens=${tokens.join(",")}`),
  getHistoricalPrices: (token: string, timeframe: string) =>
    api.get(`/prices/${token}/history?timeframe=${timeframe}`),
};
```

### Step 4.2: Create Data Hooks

Create `hooks/usePoolData.ts`:

```typescript
import useSWR from "swr";
import { poolsApi } from "@/lib/api";
import { useAccount } from "wagmi";

export function usePools() {
  const { data, error, isLoading } = useSWR("/pools", () =>
    poolsApi.getAllPools().then((res) => res.data)
  );

  return {
    pools: data || [],
    isLoading,
    error,
  };
}

export function useUserDeposits() {
  const { address } = useAccount();

  const { data, error, isLoading } = useSWR(
    address ? `/pools/user/${address}` : null,
    () => poolsApi.getUserDeposits(address!).then((res) => res.data)
  );

  return {
    deposits: data || [],
    isLoading,
    error,
  };
}
```

Create `hooks/useLoanData.ts`:

```typescript
import useSWR from "swr";
import { loansApi } from "@/lib/api";
import { useAccount } from "wagmi";

export function useUserLoans() {
  const { address } = useAccount();

  const { data, error, isLoading, mutate } = useSWR(
    address ? `/loans/user/${address}` : null,
    () => loansApi.getUserLoans(address!).then((res) => res.data)
  );

  return {
    loans: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}
```

Create `hooks/usePriceData.ts`:

```typescript
import useSWR from "swr";
import { priceApi } from "@/lib/api";

export function useTokenPrices(tokens: string[]) {
  const { data, error, isLoading } = useSWR(
    tokens.length > 0 ? `/prices?tokens=${tokens.join(",")}` : null,
    () => priceApi.getTokenPrices(tokens).then((res) => res.data),
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  return {
    prices: data || {},
    isLoading,
    error,
  };
}
```

**Commit Message**: `feat: implement API service layer and data fetching hooks`

---

## Phase 5: Component Integration - Header & Wallet

### Step 5.1: Update Header Component

Replace `components/header.tsx`:

```typescript
"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { supportedChains } from "@/lib/web3-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const currentChain = supportedChains.find((chain) => chain.id === chainId);

  const handleWalletConnect = () => {
    const injectedConnector = connectors.find((c) => c.type === "injected");
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="relative z-50 px-6 py-4 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2 text-gray-900">
          <span className="text-xl font-bold">Axios</span>
        </Link>

        {/* Middle navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/earn"
            className="text-gray-700 hover:text-[rgb(27,158,238)]"
          >
            Earn
          </Link>
          <Link
            href="/borrow"
            className="text-gray-700 hover:text-[rgb(27,158,238)]"
          >
            Borrow
          </Link>
        </nav>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {/* Network Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 rounded-xl px-3">
                <span
                  className="mr-2 inline-block h-5 w-5 rounded-full"
                  style={{
                    backgroundColor:
                      currentChain?.nativeCurrency.symbol === "ETH"
                        ? "#627eea"
                        : "#8247e5",
                  }}
                />
                <span className="mr-1">{currentChain?.name || "Unknown"}</span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>Networks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {supportedChains.map((chain) => (
                <DropdownMenuItem
                  key={chain.id}
                  onClick={() => switchChain?.({ chainId: chain.id })}
                  className={chainId === chain.id ? "bg-gray-100" : ""}
                >
                  <span
                    className="mr-2 inline-block h-5 w-5 rounded-full"
                    style={{
                      backgroundColor:
                        chain.nativeCurrency.symbol === "ETH"
                          ? "#627eea"
                          : "#8247e5",
                    }}
                  />
                  {chain.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wallet Connection */}
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-xl h-10 px-4 bg-[rgb(27,158,238)] hover:bg-[rgb(17,138,218)]">
                  {formatAddress(address!)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(address!)}
                >
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => disconnect()}>
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleWalletConnect}
              className="rounded-xl h-10 px-4 bg-[rgb(27,158,238)] hover:bg-[rgb(17,138,218)]"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
```

**Commit Message**: `feat: integrate wallet connection and network switching in header`

---

## Phase 6: Replace Dummy Data - Earn Explorer

### Step 6.1: Update Earn Explorer Component

Replace the dummy data arrays in `components/earn-explorer.tsx`:

```typescript
"use client";

import { useMemo, useState } from "react";
import { Search, ChevronRight, Plus } from "lucide-react";
import PoolDetail from "./pool-detail";
import LoanDetail from "./loan-detail";
import PairDetail from "./pair-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePools } from "@/hooks/usePoolData";
import { useUserLoans } from "@/hooks/useLoanData";
import { useAccount } from "wagmi";

// Type definitions remain the same...

export default function EarnExplorer() {
  const { address } = useAccount();
  const { pools, isLoading: poolsLoading } = usePools();
  const { loans, isLoading: loansLoading } = useUserLoans();

  const [tab, setTab] = useState<string>("pools");
  const [query, setQuery] = useState<string>("");
  const [loanStatusFilter, setLoanStatusFilter] = useState<string>("active");
  const [selectedAsset, setSelectedAsset] = useState<
    "USDC" | "BTC" | "WETH" | "FUEL"
  >("USDC");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [selectedPair, setSelectedPair] = useState<PairData | null>(null);

  // Filter pools based on real data
  const filteredPools = useMemo(() => {
    if (poolsLoading) return [];
    const q = query.trim().toLowerCase();
    const byAsset = pools.filter((pool: any) => pool.asset === selectedAsset);
    if (!q) return byAsset;
    return byAsset.filter((pool: any) =>
      [pool.symbol, pool.name, pool.pair].some((v: string) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [query, selectedAsset, pools, poolsLoading]);

  // Show loading states
  if (poolsLoading || loansLoading) {
    return (
      <div className="sticky top-24 w-full">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border bg-gray-50 p-4 md:p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Rest of component logic remains similar but uses real data...
}
```

**Commit Message**: `feat: replace dummy data with real API data in earn explorer`

---

## Phase 7: Replace Dummy Data - Borrow Explorer

### Step 7.1: Update Borrow Explorer Component

Update `components/borrow-explorer.tsx` to use real data:

```typescript
"use client";

import { useMemo, useState } from "react";
import { useTokenPrices } from "@/hooks/usePriceData";
import { useAccount } from "wagmi";
// ... other imports

export default function BorrowExplorer() {
  const { address } = useAccount();
  const [selectedTokens, setSelectedTokens] = useState<string[]>([
    "WBTC",
    "WETH",
    "PEPE",
  ]);
  const { prices, isLoading: pricesLoading } = useTokenPrices(selectedTokens);

  // Replace PRICES_USD constant with real price data
  const PRICES_USD = useMemo(() => {
    if (pricesLoading) return {};
    return prices;
  }, [prices, pricesLoading]);

  // Rest of component uses real price data...
}
```

### Step 7.2: Update Loan Interface Component

Update `components/loan-interface.tsx`:

```typescript
"use client";

import { useMemo, useState } from "react";
import { useTokenPrices } from "@/hooks/usePriceData";
// ... other imports

export default function LoanInterface() {
  const { prices, isLoading } = useTokenPrices(["ETH", "USDT", "BTC", "FUEL"]);

  const PRICES_USD = useMemo(() => {
    if (isLoading)
      return {
        eth: 4200, // fallback values
        usdt: 1,
        btc: 119000,
        fuel: 0.007871,
      };
    return {
      eth: prices.ETH || 4200,
      usdt: prices.USDT || 1,
      btc: prices.BTC || 119000,
      fuel: prices.FUEL || 0.007871,
    };
  }, [prices, isLoading]);

  // Rest of component logic...
}
```

**Commit Message**: `feat: integrate real price data in borrow components`

---

## Phase 8: Transaction Integration

### Step 8.1: Create Transaction Hooks

Create `hooks/useTransactions.ts`:

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAxiosCore, useAxiosPool } from "./useContracts";
import { parseEther } from "viem";

export function useDeposit() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deposit = async (poolAddress: string, amount: string) => {
    writeContract({
      address: poolAddress,
      abi: poolABI,
      functionName: "deposit",
      args: [parseEther(amount)],
    });
  };

  return {
    deposit,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useBorrow() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const borrow = async (
    collateralToken: string,
    collateralAmount: string,
    borrowAmount: string,
    duration: number
  ) => {
    writeContract({
      address: process.env.NEXT_PUBLIC_Axios_CORE_CONTRACT,
      abi: coreABI,
      functionName: "createLoan",
      args: [
        collateralToken,
        parseEther(collateralAmount),
        parseEther(borrowAmount),
        duration,
      ],
    });
  };

  return {
    borrow,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}
```

### Step 8.2: Integrate Transactions in Components

Update components to include actual transaction functionality:

```typescript
// In pool detail component
const { deposit, isPending, isSuccess } = useDeposit();

const handleDeposit = async () => {
  try {
    await deposit(pool.address, depositAmount);
    // Show success message
  } catch (error) {
    // Show error message
  }
};

// In borrow component
const { borrow, isPending, isSuccess } = useBorrow();

const handleBorrow = async () => {
  try {
    await borrow(collateralToken, collateralAmount, borrowAmount, duration);
    // Show success message
  } catch (error) {
    // Show error message
  }
};
```

**Commit Message**: `feat: implement transaction hooks and integrate with UI components`

---

## Phase 9: Error Handling & Loading States

### Step 9.1: Create Error Boundary

Create `components/error-boundary.tsx`:

```typescript
"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertDescription>
              Something went wrong. Please refresh the page and try again.
              <Button
                className="mt-2 w-full"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Step 9.2: Add Toast Notifications

Create `hooks/useNotifications.ts`:

```typescript
import { toast } from "sonner";

export function useNotifications() {
  const notifySuccess = (message: string) => {
    toast.success(message);
  };

  const notifyError = (message: string) => {
    toast.error(message);
  };

  const notifyLoading = (message: string) => {
    return toast.loading(message);
  };

  const notifyTransactionSuccess = (hash: string) => {
    toast.success("Transaction confirmed!", {
      action: {
        label: "View",
        onClick: () => window.open(`https://etherscan.io/tx/${hash}`, "_blank"),
      },
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyLoading,
    notifyTransactionSuccess,
  };
}
```

**Commit Message**: `feat: add error boundary and notification system`

---

## Phase 10: Testing & Optimization

### Step 10.1: Add Loading Skeletons

Create `components/ui/skeleton-loader.tsx`:

```typescript
export function PoolSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-6 gap-4 p-4 border-b">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
```

### Step 10.2: Add Data Validation

Create `lib/validators.ts`:

```typescript
import { z } from "zod";

export const PoolSchema = z.object({
  id: z.string(),
  asset: z.string(),
  symbol: z.string(),
  name: z.string(),
  pair: z.string(),
  liquidity: z.string(),
  debt: z.string(),
  yield: z.number(),
  myDeposit: z.string(),
});

export const LoanSchema = z.object({
  id: z.string(),
  collateral: z.string(),
  amount: z.string(),
  apr: z.number(),
  duration: z.string(),
  date: z.string(),
  status: z.enum(["Active", "Past"]),
});

export function validatePoolData(data: unknown) {
  return PoolSchema.safeParse(data);
}
```

**Commit Message**: `feat: add loading skeletons and data validation`

---

## Phase 11: Final Integration & Testing

### Step 11.1: Integration Checklist

- [ ] Wallet connection works across all supported networks
- [ ] Pool data loads from real API endpoints
- [ ] Loan creation transactions execute successfully
- [ ] Price data updates in real-time
- [ ] Error states are handled gracefully
- [ ] Loading states provide good UX
- [ ] Network switching works properly
- [ ] Transaction confirmations are tracked

### Step 11.2: Environment Setup for Production

Create `next.config.mjs` updates:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
```

**Commit Message**: `feat: finalize production configuration and integration testing`

---

## Deployment Strategy

### Git Workflow & Commit Strategy

1. **Feature Branches**: Create separate branches for each phase

   ```bash
   git checkout -b feat/web3-setup
   git checkout -b feat/contract-integration
   git checkout -b feat/data-layer
   git checkout -b feat/ui-integration
   ```

2. **Commit Messages**: Follow conventional commits

   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for code refactoring
   - `docs:` for documentation
   - `test:` for adding tests

3. **Pull Request Process**:
   - Each phase should be a separate PR
   - Include testing screenshots
   - Document any breaking changes
   - Review smart contract interactions carefully

### Testing Before Production

1. **Local Testing**:

   ```bash
   pnpm dev
   # Test all wallet connections
   # Test all transaction flows
   # Test error scenarios
   ```

2. **Staging Deployment**:

   - Deploy to testnet first
   - Test with real testnet transactions
   - Validate all API endpoints
   - Performance testing with real data

3. **Production Readiness**:
   - All environment variables configured
   - Smart contracts audited and deployed
   - API endpoints stable and monitored
   - Error tracking implemented (Sentry)

## Support & Maintenance

### Monitoring Setup

- API endpoint monitoring
- Transaction success rates
- Wallet connection success rates
- Error rate tracking
- Performance metrics

### Update Strategy

- Regular dependency updates
- Smart contract upgrade procedures
- API versioning strategy
- Backward compatibility considerations

---

This guide provides a complete roadmap for integrating your Axios DeFi platform with real blockchain functionality. Each phase builds upon the previous one, ensuring a smooth transition from dummy data to a fully functional DeFi application.

Remember to:

- Test thoroughly at each phase
- Keep your smart contracts secure
- Monitor the application in production
- Have rollback procedures ready
- Document any custom modifications

Your developer should follow this guide step by step, implementing each phase completely before moving to the next one. The modular approach ensures that if issues arise, they can be isolated to specific components.
