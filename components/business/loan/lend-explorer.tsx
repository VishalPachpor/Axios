"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import LendDetail from "./lend-detail";
import LoanDetail from "./loan-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Pool data structure
type Pool = {
  assetA: string;
  assetB: string;
  pair: string;
  liquidity: string;
  debt: string;
  yield: number;
  myDeposit: string;
  logo?: string;
};

// Token type
type Token = {
  symbol: string;
  name: string;
};

const TOKENS: Token[] = [
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "FUEL", name: "Fuel" },
];

// Loan data structure for lending
type LoanStatus = "requested" | "active" | "cancelled" | "claimed";

type Loan = {
  id: string;
  collateral: string;
  collateralToken: string;
  lendToken: string;
  lendAmount: string;
  interest: string;
  duration: string;
  durationType: string;
  status: LoanStatus;
  createdAt: number;
  // Additional properties for LoanDetail compatibility
  amount: string;
  borrowAmount: string;
  apr: number;
  date: string;
};

// Helper to deduplicate pairs (USDC/FUEL == FUEL/USDC)
function getUniquePairs(pools: Pool[]) {
  const seen = new Set<string>();
  return pools.filter((pool) => {
    const [a, b] = pool.pair.split("/");
    const key = [a, b].sort().join("/");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Sample pool data (amounts and deposits set to zero)
const POOLS: Pool[] = [
  {
    assetA: "USDC",
    assetB: "FUEL",
    pair: "USDC/FUEL",
    liquidity: "0.00",
    debt: "0.00",
    yield: 0.0,
    myDeposit: "0.00",
  },
  {
    assetA: "USDC",
    assetB: "ETH",
    pair: "USDC/ETH",
    liquidity: "0.00",
    debt: "0.00",
    yield: 0.0,
    myDeposit: "0.00",
  },
  {
    assetA: "ETH",
    assetB: "FUEL",
    pair: "ETH/FUEL",
    liquidity: "0.00",
    debt: "0.00",
    yield: 0.0,
    myDeposit: "0.00",
  },
];

// Sample loan data
const LOANS: Loan[] = [
  {
    id: "loan-001",
    collateral: "1000",
    collateralToken: "USDC",
    lendToken: "FUEL",
    lendAmount: "500",
    interest: "12.5",
    duration: "30",
    durationType: "days",
    status: "active",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    amount: "1000",
    borrowAmount: "500",
    apr: 12.5,
    date: "08/08/25",
  },
  {
    id: "loan-002",
    collateral: "2000",
    collateralToken: "ETH",
    lendToken: "USDC",
    lendAmount: "1",
    interest: "8.2",
    duration: "14",
    durationType: "days",
    status: "requested",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    amount: "2000",
    borrowAmount: "1",
    apr: 8.2,
    date: "08/08/25",
  },
];

export default function LendExplorer() {
  const [tab, setTab] = useState("lend");
  const [query, setQuery] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);

  // Form state for lend tab
  const [collateral, setCollateral] = useState("");
  const [collateralToken, setCollateralToken] = useState("USDC");
  const [interest, setInterest] = useState("");
  const [lendToken, setLendToken] = useState("FUEL");
  const [lendAmount, setLendAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [durationType, setDurationType] = useState("days");

  // Filter pools based on search query
  const filteredPools = useMemo(() => {
    if (!query.trim()) return getUniquePairs(POOLS);
    const searchQuery = query.toLowerCase();
    return getUniquePairs(POOLS).filter((pool) =>
      pool.pair.toLowerCase().includes(searchQuery)
    );
  }, [query]);

  // Filter loans based on search query
  const filteredLoans = useMemo(() => {
    if (!query.trim()) return LOANS;
    const searchQuery = query.toLowerCase();
    return LOANS.filter(
      (loan) =>
        loan.collateralToken.toLowerCase().includes(searchQuery) ||
        loan.lendToken.toLowerCase().includes(searchQuery)
    );
  }, [query]);

  const handleRequestLoan = () => {
    // Handle loan request logic
    console.log("Requesting loan:", {
      collateral,
      collateralToken,
      interest,
      lendToken,
      lendAmount,
      duration,
      durationType,
    });
  };

  const handleClaimBack = (loanId: string) => {
    // Handle claim back logic
    console.log("Claiming back loan:", loanId);
  };

  const toggleLoanExpansion = (loanId: string) => {
    setExpandedLoan(expandedLoan === loanId ? null : loanId);
  };

  // Calculate repayment amount for a loan
  const calculateRepaymentAmount = (loan: Loan) => {
    const principal = parseFloat(loan.lendAmount);
    const interestRate = parseFloat(loan.interest) / 100;
    const durationInDays = parseFloat(loan.duration);
    const interestAmount = principal * interestRate * (durationInDays / 365);
    return (principal + interestAmount).toFixed(2);
  };

  // Check if loan is expired
  const isLoanExpired = (loan: Loan) => {
    const durationInMs = parseFloat(loan.duration) * 24 * 60 * 60 * 1000; // Convert days to ms
    return Date.now() > loan.createdAt + durationInMs;
  };

  // Show loan detail if a loan is selected
  if (selectedLoan) {
    return (
      <LoanDetail loan={selectedLoan} onBack={() => setSelectedLoan(null)} />
    );
  }

  // Show lend detail if a pool is selected
  if (selectedPool) {
    return (
      <LendDetail pool={selectedPool} onBack={() => setSelectedPool(null)} />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="min-h-[500px] sm:min-h-[600px]">
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v);
            setQuery(""); // Reset search when switching tabs
          }}
          className="w-full h-full"
        >
          {/* Tabs Header - Always Visible */}
          <TabsList className="grid w-full grid-cols-3 rounded-xl mb-3 sm:mb-4 bg-muted/50 p-1">
            <TabsTrigger
              value="lend"
              className="text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg"
            >
              Lend
            </TabsTrigger>
            <TabsTrigger
              value="pools"
              className="text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg"
            >
              Borrow Orders
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg"
            >
              My Loans
            </TabsTrigger>
          </TabsList>

          {/* LEND TAB */}
          <TabsContent
            value="lend"
            className="mt-0 transition-all duration-300 ease-in-out h-[600px]"
          >
            <Card className="p-3 sm:p-4 border border-border bg-card h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left side: Collateral, Collateral Token, Interest */}
                <div>
                  <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-foreground">
                    Collateral (deposit)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={collateral}
                    onChange={(e) => setCollateral(e.target.value)}
                    placeholder="Enter collateral amount"
                    className="mb-2 sm:mb-4 h-8 sm:h-10 text-xs sm:text-sm"
                  />
                  <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-foreground">
                    Collateral Token
                  </label>
                  <Select
                    value={collateralToken}
                    onValueChange={setCollateralToken}
                  >
                    <SelectTrigger className="w-full h-8 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <label className="block mt-2 sm:mt-4 mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-foreground">
                    Interest (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="Enter interest rate"
                    className="mb-2 sm:mb-4 h-8 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                {/* Right side: Lend Token, Lend Amount, Duration */}
                <div>
                  <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-foreground">
                    Lend Token
                  </label>
                  <Select value={lendToken} onValueChange={setLendToken}>
                    <SelectTrigger className="w-full h-8 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <label className="block mt-2 sm:mt-4 mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-foreground">
                    Lend Amount
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={lendAmount}
                    onChange={(e) => setLendAmount(e.target.value)}
                    placeholder="Enter lend amount"
                    className="mb-2 sm:mb-4 h-8 sm:h-10 text-xs sm:text-sm"
                  />
                  <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-foreground">
                    Duration
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Enter duration"
                      className="mb-2 sm:mb-4 h-8 sm:h-10 text-xs sm:text-sm flex-1"
                    />
                    <Select
                      value={durationType}
                      onValueChange={setDurationType}
                    >
                      <SelectTrigger className="w-20 sm:w-24 h-8 sm:h-10 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-20 sm:w-24">
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 sm:mt-6 flex justify-center">
                <Button
                  onClick={handleRequestLoan}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 h-9 sm:h-10 text-sm sm:text-base w-full sm:w-auto"
                >
                  Deposit & Lend
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* POOLS TAB */}
          <TabsContent
            value="pools"
            className="mt-0 transition-all duration-300 ease-in-out h-[600px]"
          >
            <Card className="p-3 sm:p-4 border border-border bg-card h-full">
              <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                <div className="relative ml-auto w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 rounded-xl h-8 sm:h-10 text-xs sm:text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background">
                {/* Header */}
                <div className="grid grid-cols-6 gap-2 sm:gap-4 p-3 sm:p-4 border-b border-border text-xs sm:text-sm font-medium text-muted-foreground">
                  <div className="col-span-2 sm:col-span-1">Pair</div>
                  <div className="hidden sm:block">Liquidity</div>
                  <div className="hidden md:block">Debt</div>
                  <div className="col-span-2 sm:col-span-1">Yield</div>
                  <div className="hidden sm:block">My deposit</div>
                  <div></div>
                </div>

                {/* Pool rows */}
                <ScrollArea className="h-[350px] sm:h-[450px]">
                  {filteredPools.map((pool, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-6 gap-2 sm:gap-4 p-3 sm:p-4 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPool(pool)}
                    >
                      <div className="col-span-2 sm:col-span-1 flex items-center gap-2 sm:gap-3">
                        <div className="flex -space-x-2">
                          {/* <div className="w-6 h-6 rounded-full bg-primary border-2 border-background"></div>
                      <div className="w-6 h-6 rounded-full bg-secondary border-2 border-background"></div> */}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-xs sm:text-sm">
                            {pool.pair}
                          </span>
                          {/* Mobile-only additional info */}
                          <span className="sm:hidden text-xs text-muted-foreground">
                            Liquidity: {pool.liquidity}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center">
                        <span className="text-foreground text-xs sm:text-sm">
                          {pool.liquidity}
                        </span>
                      </div>
                      <div className="hidden md:flex items-center">
                        <span className="text-foreground text-xs sm:text-sm">
                          {pool.debt}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex items-center">
                        <div className="flex flex-col">
                          <span className="text-primary font-semibold text-xs sm:text-sm">
                            {pool.yield.toFixed(2)}%
                          </span>
                          {/* Mobile-only additional info */}
                          <span className="sm:hidden text-xs text-muted-foreground">
                            Debt: {pool.debt}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center">
                        <span className="text-foreground text-xs sm:text-sm">
                          {pool.myDeposit}
                        </span>
                      </div>
                      <div className="flex items-center justify-end"></div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </Card>
          </TabsContent>

          {/* LOANS TAB */}
          <TabsContent
            value="loans"
            className="mt-0 transition-all duration-300 ease-in-out h-[600px]"
          >
            <Card className="p-3 sm:p-4 border border-border bg-card h-full">
              <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                <div className="relative ml-auto w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search loans..."
                    className="pl-9 rounded-xl h-8 sm:h-10 text-xs sm:text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredLoans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No loans found
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLoans.map((loan) => {
                    const expanded = expandedLoan === loan.id;
                    const repaymentAmount = calculateRepaymentAmount(loan);
                    const expired = isLoanExpired(loan);

                    return (
                      <Card key={loan.id} className="overflow-hidden">
                        <button
                          className="w-full p-4 sm:p-6 text-left hover:bg-accent/50 transition-colors"
                          onClick={() => toggleLoanExpansion(loan.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {loan.collateralToken.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-foreground text-sm sm:text-base">
                                  {loan.collateral} {loan.collateralToken}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  {loan.status.charAt(0).toUpperCase() +
                                    loan.status.slice(1)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-sm sm:text-base">
                                {loan.lendAmount} {loan.lendToken}
                              </span>
                              {expanded ? (
                                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          {expanded && (
                            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 bg-muted/30 mt-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Collateral
                                  </div>
                                  <div className="font-semibold text-foreground text-sm sm:text-base">
                                    {loan.collateral} {loan.collateralToken}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Lend Amount
                                  </div>
                                  <div className="font-semibold text-foreground text-sm sm:text-base">
                                    {loan.lendAmount} {loan.lendToken}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Interest Rate
                                  </div>
                                  <div className="font-semibold text-foreground text-sm sm:text-base">
                                    {loan.interest}%
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Duration
                                  </div>
                                  <div className="font-semibold text-foreground text-sm sm:text-base">
                                    {loan.duration} {loan.durationType}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Status
                                  </div>
                                  <div className="font-semibold text-foreground text-sm sm:text-base">
                                    {loan.status.charAt(0).toUpperCase() +
                                      loan.status.slice(1)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Repayment Amount
                                  </div>
                                  <div className="font-semibold text-primary text-sm sm:text-base">
                                    {repaymentAmount} {loan.lendToken}
                                  </div>
                                </div>
                                {expired && loan.status !== "claimed" && (
                                  <Button
                                    className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm h-8 sm:h-9"
                                    onClick={() => handleClaimBack(loan.id)}
                                  >
                                    Claim Back
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </button>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
