"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Star,
  Flame,
  DollarSign,
  Diamond,
  RefreshCw,
  Bitcoin,
  Grid,
  Zap,
  Coins,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VaultDetail from "./vault-detail";

// Vault data structure
type Vault = {
  id: string;
  name: string;
  depositToken: string;
  depositIcon: "zap" | "coins" | "trending-up" | "shield" | "refresh-cw";
  curator: string;
  curatorLogo: string;
  apy: number;
  tvl: string;
  status: "active" | "inactive";
  category: "featured" | "popular" | "stablecoins" | "lst" | "lp";
  underlyingAssets?: string[];
  description: string;
  supplied: string;
  limit: string;
  availableLiquidity: string;
};

// Icon mapping component
const VaultIcon = ({ icon }: { icon: Vault["depositIcon"] }) => {
  const iconMap = {
    zap: <Zap className="h-6 w-6 text-primary" />,
    coins: <Coins className="h-6 w-6 text-primary" />,
    "trending-up": <TrendingUp className="h-6 w-6 text-primary" />,
    shield: <Shield className="h-6 w-6 text-primary" />,
    "refresh-cw": <RefreshCw className="h-6 w-6 text-primary" />,
  };

  return iconMap[icon] || <Zap className="h-6 w-6 text-primary" />;
};

// Sample vaults data
const VAULTS: Vault[] = [
  {
    id: "vault-001",
    name: "The Rig (stFUEL)",
    depositToken: "stFUEL",
    depositIcon: "zap",
    curator: "The Rig",
    curatorLogo: "🔵",
    apy: 0,
    tvl: "0",
    status: "active",
    category: "featured",
    underlyingAssets: ["FUEL", "stFUEL"],
    description:
      "stFUEL-focused strategy powered by The Rig on Fuel for sustainable yield",
    supplied: "0",
    limit: "0",
    availableLiquidity: "0",
  },
  {
    id: "vault-002",
    name: "USDC Stable Vault",
    depositToken: "USDC",
    depositIcon: "coins",
    curator: "axios",
    curatorLogo: "🔵",
    apy: 0,
    tvl: "0",
    status: "active",
    category: "stablecoins",
    underlyingAssets: ["USDC"],
    description: "Stablecoin strategy for USDC deposits on Fuel",
    supplied: "0",
    limit: "0",
    availableLiquidity: "0",
  },
  {
    id: "vault-003",
    name: "V12 Orderbook",
    depositToken: "FUEL",
    depositIcon: "trending-up",
    curator: "V12",
    curatorLogo: "🔵",
    apy: 0,
    tvl: "0",
    status: "active",
    category: "popular",
    underlyingAssets: ["FUEL", "USDC"],
    description:
      "Orderbook-driven yield strategy referencing V12 markets on Fuel",
    supplied: "0",
    limit: "0",
    availableLiquidity: "0",
  },
  {
    id: "vault-004",
    name: "stFUEL LST",
    depositToken: "stFUEL",
    depositIcon: "zap",
    curator: "The Rig",
    curatorLogo: "🔵",
    apy: 0,
    tvl: "0",
    status: "active",
    category: "lst",
    underlyingAssets: ["FUEL", "stFUEL"],
    description: "Fuel-native liquid staking strategy centered around stFUEL",
    supplied: "0",
    limit: "0",
    availableLiquidity: "0",
  },
  {
    id: "vault-005",
    name: "Diesel DEX LP",
    depositToken: "LP",
    depositIcon: "refresh-cw",
    curator: "Diesel Dex",
    curatorLogo: "🔵",
    apy: 0,
    tvl: "0",
    status: "active",
    category: "lp",
    underlyingAssets: ["FUEL-USDC"],
    description: "LP strategy across Diesel Dex pools on Fuel",
    supplied: "0",
    limit: "0",
    availableLiquidity: "0",
  },
  {
    id: "vault-006",
    name: "Swaylend Markets",
    depositToken: "FUEL",
    depositIcon: "shield",
    curator: "Swaylend",
    curatorLogo: "🔵",
    apy: 0,
    tvl: "0",
    status: "active",
    category: "popular",
    underlyingAssets: ["FUEL", "USDC"],
    description: "Lending-driven strategy referencing Swaylend markets on Fuel",
    supplied: "0",
    limit: "0",
    availableLiquidity: "0",
  },
  {
    id: "vault-007",
    name: "FUEL Yield Strategy",
    depositToken: "FUEL",
    depositIcon: "zap",
    curator: "Microchain",
    curatorLogo: "🔵",
    apy: 0,
    tvl: "0",
    status: "active",
    category: "featured",
    underlyingAssets: ["FUEL", "stFUEL"],
    description:
      "High-performance strategy aligned with Fuel-native DEX and LST flows",
    supplied: "0",
    limit: "0",
    availableLiquidity: "0",
  },
  {
    id: "vault-008",
    name: "ETH Bridge Vault",
    depositToken: "ETH",
    depositIcon: "trending-up",
    curator: "axios",
    curatorLogo: "🔵",
    apy: 0,
    tvl: "0",
    status: "active",
    category: "popular",
    underlyingAssets: ["ETH", "USDC"],
    description: "ETH strategy leveraging bridged Ethereum assets on Fuel",
    supplied: "0",
    limit: "0",
    availableLiquidity: "0",
  },
];

export default function EarnExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const vaultsPerPage = 8;

  // Move categories inside component to prevent prerendering issues
  const categories = [
    { id: "all", label: "All", icon: Grid },
    { id: "featured", label: "Featured", icon: Star },
    { id: "popular", label: "Popular", icon: Flame },
    { id: "stablecoins", label: "Stablecoins", icon: DollarSign },
    { id: "lst", label: "stFUEL & LST", icon: Diamond },
    { id: "lp", label: "LP", icon: RefreshCw },
  ];

  // Filter vaults by category and search
  const filteredVaults = useMemo(() => {
    let filtered = VAULTS;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (vault) => vault.category === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (vault) =>
          vault.name.toLowerCase().includes(query) ||
          vault.depositToken.toLowerCase().includes(query) ||
          vault.curator.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredVaults.length / vaultsPerPage);
  const startIndex = (currentPage - 1) * vaultsPerPage;
  const paginatedVaults = filteredVaults.slice(
    startIndex,
    startIndex + vaultsPerPage
  );

  const handleDeposit = (vault: Vault) => {
    setSelectedVault(vault);
  };

  // Show vault detail if a vault is selected
  if (selectedVault) {
    return (
      <VaultDetail
        vault={selectedVault}
        onBack={() => setSelectedVault(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="min-h-[500px] sm:min-h-[600px]">
        {/* Header Section */}
        <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4 sm:mb-6">
            Explore Fuel Defi Vaults
          </h1>

          {/* Category Tabs - Single Row on Desktop */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border/50"
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by token or protocol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 rounded-xl h-10 sm:h-11 text-sm sm:text-base border-border/50 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Vaults Content Section */}
        <Card className="border border-border bg-card min-h-[400px] sm:min-h-[500px] shadow-sm">
          {/* Vaults Table Header */}
          <div className="grid grid-cols-2 gap-4 p-4 sm:p-6 border-b border-border text-sm font-medium text-muted-foreground bg-muted/20">
            <div>Vault</div>
            <div className="text-right">APY</div>
          </div>

          {/* Vaults List */}
          <div className="divide-y divide-border/50">
            {paginatedVaults.map((vault) => (
              <div
                key={vault.id}
                className="p-4 sm:p-6 hover:bg-accent/30 transition-all duration-200 cursor-pointer group"
                onClick={() => handleDeposit(vault)}
              >
                <div className="flex items-center justify-between">
                  {/* Vault Info */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/20 flex items-center justify-center text-base sm:text-lg group-hover:bg-primary/30 transition-colors">
                      <VaultIcon icon={vault.depositIcon} />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                        {vault.name}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {vault.depositToken}
                      </div>
                    </div>
                  </div>

                  {/* APY and Action */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-semibold text-primary">
                        {vault.apy}%
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {vault.tvl} TVL
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 h-9 sm:h-10 text-sm sm:text-base shadow-sm hover:shadow-md">
                      Deposit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 border-t border-border gap-3 sm:gap-0">
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Showing {startIndex + 1}-
                {Math.min(startIndex + vaultsPerPage, filteredVaults.length)} of{" "}
                {filteredVaults.length} vaults
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl h-8 sm:h-9 px-3"
                >
                  &lt;
                </Button>
                <span className="text-sm text-muted-foreground px-3">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-xl h-8 sm:h-9 px-3"
                >
                  &gt;
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
