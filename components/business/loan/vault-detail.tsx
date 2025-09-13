"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Info,
  ExternalLink,
  Filter,
  ChevronDown,
  Zap,
  Coins,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Icon mapping component
const VaultIcon = ({
  icon,
}: {
  icon: "zap" | "coins" | "trending-up" | "shield" | "refresh-cw";
}) => {
  const iconMap = {
    zap: <Zap className="h-6 w-6 text-primary" />,
    coins: <Coins className="h-6 w-6 text-primary" />,
    "trending-up": <TrendingUp className="h-6 w-6 text-primary" />,
    shield: <Shield className="h-6 w-6 text-primary" />,
    "refresh-cw": <RefreshCw className="h-6 w-6 text-primary" />,
  };

  return iconMap[icon] || <Zap className="h-6 w-6 text-primary" />;
};

type VaultDetailProps = {
  vault: {
    id: string;
    name: string;
    depositToken: string;
    depositIcon: "zap" | "coins" | "trending-up" | "shield" | "refresh-cw";
    curator: string;
    curatorLogo: string;
    apy: number;
    tvl: string;
    status: string;
    category: string;
    description: string;
    supplied: string;
    limit: string;
    availableLiquidity: string;
  };
  onBack: () => void;
};

type LoanSource = {
  name: string;
  icon: string;
  allocation: string;
  allocationUSD: string;
  percentage: string;
  loans: string;
  apy: number;
};

type Collateral = {
  name: string;
  icon: string;
  apy: number;
  ltv: string;
  liquidationLtv: string;
};

const loanSources: LoanSource[] = [
  {
    name: "FUEL-USDC LP",
    icon: "🔵",
    allocation: "0 USDC",
    allocationUSD: "$0",
    percentage: "0%",
    loans: "0 loans",
    apy: 0,
  },
  {
    name: "FUEL-ETH LP",
    icon: "⚡",
    allocation: "0 USDC",
    allocationUSD: "$0",
    percentage: "0%",
    loans: "0 loans",
    apy: 0,
  },
  {
    name: "Swaylend Markets",
    icon: "🟦",
    allocation: "0 USDC",
    allocationUSD: "$0",
    percentage: "0%",
    loans: "0 loans",
    apy: 0,
  },
];

const collaterals: Collateral[] = [
  {
    name: "FUEL",
    icon: "⛽️",
    apy: 0,
    ltv: "0%",
    liquidationLtv: "0%",
  },
  {
    name: "stFUEL",
    icon: "⚡",
    apy: 0,
    ltv: "0%",
    liquidationLtv: "0%",
  },
  {
    name: "USDC",
    icon: "🔵",
    apy: 0,
    ltv: "0%",
    liquidationLtv: "0%",
  },
  {
    name: "ETH",
    icon: "⚡",
    apy: 0,
    ltv: "0%",
    liquidationLtv: "0%",
  },
];

export default function VaultDetail({ vault, onBack }: VaultDetailProps) {
  const [activeTab, setActiveTab] = useState<string>("deposit");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [collateralPage, setCollateralPage] = useState<number>(1);

  const handleDeposit = () => {
    if (!depositAmount) return;
    console.log(
      `Depositing ${depositAmount} ${vault.depositToken} into ${vault.name}`
    );
  };

  const handleWithdraw = () => {
    if (!depositAmount) return;
    console.log(
      `Withdrawing ${depositAmount} ${vault.depositToken} from ${vault.name}`
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2 hover:bg-muted/30"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <span className="text-sm sm:text-base text-muted-foreground">
              All Vaults
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/20 flex items-center justify-center text-base sm:text-lg">
                <VaultIcon icon={vault.depositIcon} />
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
                {vault.name}
              </h1>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30 px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <Star className="h-3 w-3 mr-1" />
              Featured Vault
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left Section - Vault Information */}
        <div className="space-y-4 sm:space-y-6">
          {/* Supplied/Limit Section */}
          <Card className="p-4 sm:p-6 rounded-2xl">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <span className="text-sm sm:text-base text-muted-foreground">
                  Supplied
                </span>
                <div className="text-left sm:text-right">
                  <div className="text-base sm:text-lg font-semibold text-foreground">
                    0 {vault.depositToken}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    $0
                  </div>
                </div>
              </div>

              <div className="w-full bg-muted/30 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: "0%" }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <span className="text-sm sm:text-base text-muted-foreground">
                  Limit
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base text-foreground">
                    0 {vault.depositToken} $0
                  </span>
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </Card>

          {/* Vault Description */}
          <Card className="p-4 sm:p-6 rounded-2xl">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                {vault.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Curated by
                </span>
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                  {vault.curatorLogo}
                </div>
                <span className="text-sm sm:text-base text-foreground">
                  {vault.curator}
                </span>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-4 sm:p-6 rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4">
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                  APY
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-semibold text-primary">
                    0%
                  </span>
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                  TVL
                </div>
                <div className="text-base sm:text-lg font-semibold text-foreground">
                  0 {vault.depositToken}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  $0
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Available liquidity
                </div>
                <div className="text-base sm:text-lg font-semibold text-foreground">
                  0 {vault.depositToken}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  $0
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section - Deposit/Withdraw Actions */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6 rounded-2xl">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 rounded-xl mb-4 sm:mb-6">
                <TabsTrigger
                  value="deposit"
                  className="rounded-xl text-xs sm:text-sm"
                >
                  Deposit
                </TabsTrigger>
                <TabsTrigger
                  value="withdraw"
                  className="rounded-xl text-xs sm:text-sm"
                >
                  Withdraw
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deposit" className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                    You deposit
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary">
                      <VaultIcon icon={vault.depositIcon} />
                    </div>
                    <Input
                      type="number"
                      placeholder="0"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="pl-10 pr-16 h-10 sm:h-12 rounded-xl text-sm sm:text-base"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-muted-foreground">
                      {vault.depositToken}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleDeposit}
                  disabled={!depositAmount}
                  className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-normal transition-all duration-200 text-sm sm:text-base"
                >
                  {depositAmount
                    ? `Deposit ${depositAmount} ${vault.depositToken}`
                    : "Enter an amount"}
                </Button>
              </TabsContent>

              <TabsContent value="withdraw" className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                    You withdraw
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary">
                      <VaultIcon icon={vault.depositIcon} />
                    </div>
                    <Input
                      type="number"
                      placeholder="0"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="pl-10 pr-16 h-10 sm:h-12 rounded-xl text-sm sm:text-base"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-muted-foreground">
                      {vault.depositToken}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={!depositAmount}
                  className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-normal transition-all duration-200 text-sm sm:text-base"
                >
                  {depositAmount
                    ? `Withdraw ${depositAmount} ${vault.depositToken}`
                    : "Enter an amount"}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8">
        {/* Loans Section */}
        <Card className="p-4 sm:p-6 rounded-2xl">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-8">
              <div>
                <div className="text-lg sm:text-2xl font-medium text-foreground">
                  0 USDC
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  $0
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-lg sm:text-2xl font-medium text-foreground">
                  0 loans
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 sm:pt-6">
              <div className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                Allocation
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-border text-xs sm:text-sm font-medium text-muted-foreground">
                <div className="text-center">Asset</div>
                <div className="text-center">Allocation</div>
                <div className="text-center">APY</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-0">
                {loanSources.map((source, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-border/50 last:border-b-0 items-center"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 justify-center">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted/30 flex items-center justify-center text-sm sm:text-base">
                        {source.icon}
                      </div>
                      <span className="font-medium text-foreground text-xs sm:text-sm">
                        {source.name}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground text-xs sm:text-sm">
                        {source.allocation}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {source.allocationUSD} • {source.percentage} •{" "}
                        {source.loans}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="font-medium text-primary text-xs sm:text-sm">
                        {source.apy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4 sm:mt-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    disabled
                  >
                    &lt;
                  </Button>
                  <span className="text-xs sm:text-base text-muted-foreground px-2 sm:px-3">
                    0 of 0
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    disabled
                  >
                    &gt;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Market Parameters Section */}
        <Card className="p-4 sm:p-6 rounded-2xl">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                Market parameters
              </h3>
              <p className="text-xs sm:text-base text-muted-foreground mb-4 sm:mb-6">
                The vault curator can update APYs, durations, or origination
                fees at any time. All other changes will require a 24 hour
                cool-down
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-base text-muted-foreground">
                    Liquidity buffer:
                  </span>
                  <span className="font-medium text-foreground text-xs sm:text-base">
                    0%
                  </span>
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-base text-muted-foreground">
                    Max loan size:
                  </span>
                  <span className="font-medium text-foreground text-xs sm:text-base">
                    0 USDC
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 sm:pt-6">
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                Collateral
              </h4>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search by token"
                    className="pl-10 pr-4 rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                  />
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <Input
                    placeholder="1 day"
                    className="pr-10 rounded-xl h-9 sm:h-10 text-xs sm:text-sm"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4 py-3 border-b border-border text-xs sm:text-sm font-medium text-muted-foreground">
                  <div>Collateral</div>
                  <div className="text-center">APY</div>
                  <div className="text-center">LTV</div>
                  <div className="text-center">Liquidation LTV</div>
                </div>

                {/* Table Rows */}
                {collaterals.map((collateral, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 sm:gap-4 py-3 border-b border-border/50 last:border-b-0 items-center"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 justify-center">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted/30 flex items-center justify-center text-sm sm:text-base">
                        {collateral.icon}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-medium text-foreground text-xs sm:text-sm">
                          {collateral.name}
                        </span>
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="font-medium text-primary text-xs sm:text-sm">
                        {collateral.apy}%
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-medium text-foreground text-xs sm:text-sm">
                        {collateral.ltv}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-medium text-foreground text-xs sm:text-sm">
                        {collateral.liquidationLtv}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4 sm:mt-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    disabled
                  >
                    &lt;
                  </Button>
                  <span className="text-xs sm:text-base text-muted-foreground px-2 sm:px-3">
                    1 of 21
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                  >
                    &gt;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Liquidity Management Section */}
        <Card className="p-4 sm:p-6 rounded-2xl">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                Liquidity Management
              </h3>
              <p className="text-xs sm:text-base text-muted-foreground mb-4 sm:mb-6">
                The vault curator can update the supply limit, borrow limit, and
                withdrawl limits. All changes are applied immediately.
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-xs sm:text-base text-foreground">
                    Max TVL
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-muted/30 text-muted-foreground text-xs sm:text-sm"
                  >
                    Disabled
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-xs sm:text-base text-foreground">
                    Max borrow
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-muted/30 text-muted-foreground text-xs sm:text-sm"
                  >
                    Disabled
                  </Badge>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                  Limits
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-base text-muted-foreground">
                    <div>Cap Type</div>
                    <div>1-Hour Limits</div>
                    <div>24-Hour Limits</div>
                  </div>
                  {["Deposits", "Borrow", "Withdrawals"].map((type) => (
                    <div
                      key={type}
                      className="grid grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-border/50 last:border-b-0"
                    >
                      <span className="text-xs sm:text-base text-foreground">
                        {type}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-muted/30 text-muted-foreground w-fit text-xs sm:text-sm"
                      >
                        Disabled
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-muted/30 text-muted-foreground w-fit text-xs sm:text-sm"
                      >
                        Disabled
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
