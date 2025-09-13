"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { FuelProviders } from "./FuelProvider";

// Optimize query client for better performance and wallet persistence
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - longer for wallet data
      gcTime: 30 * 60 * 1000, // 30 minutes - longer garbage collection
      retry: 1, // Reduce retry attempts
      refetchOnWindowFocus: false, // Disable refetch on focus
      refetchOnReconnect: false, // Disable refetch on reconnect
      refetchOnMount: false, // Disable refetch on mount
    },
    mutations: {
      retry: 1, // Reduce retry attempts
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProviders>{children}</FuelProviders>
    </QueryClientProvider>
  );
}
