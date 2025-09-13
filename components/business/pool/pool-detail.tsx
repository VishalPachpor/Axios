"use client";

import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import LoanDetail from "../loan/loan-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type PoolDetailProps = {
  pool: {
    assetA: string;
    assetB: string;
    pair: string;
    liquidity: string;
    debt: string;
    yield: number;
    myDeposit: string;
  };
  onBack: () => void;
};

// Sample loan history data (amounts set to zero)
const LOAN_HISTORY = [
  {
    id: "#4189",
    amount: "0.00",
    borrowAmount: "0.00",
    apr: 0.0,
    date: "00/00/00",
    status: "On time",
  },
  {
    id: "#4185",
    amount: "0.00",
    borrowAmount: "0.00",
    apr: 0.0,
    date: "00/00/00",
    status: "Paid",
  },
];

export default function PoolDetail({ pool, onBack }: PoolDetailProps) {
  const [supplyAmount, setSupplyAmount] = useState("0");
  const [collateralAmount, setCollateralAmount] = useState("0");
  const [historyTab, setHistoryTab] = useState("loan-history");
  const [selectedLoan, setSelectedLoan] = useState<{
    id: string;
    amount: string;
    borrowAmount: string;
    apr: number;
    date: string;
    status: string;
  } | null>(null);

  // Show loan detail if a loan is selected
  if (selectedLoan) {
    return (
      <LoanDetail loan={selectedLoan} onBack={() => setSelectedLoan(null)} />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-foreground">
                  Lend
                </span>
                <div className="text-foreground">{pool.assetA}</div>
                <span className="text-lg text-foreground">against</span>
                <div className="text-foreground">{pool.assetB}</div>
                <span className="text-lg text-foreground">
                  | Yield:{" "}
                  <span className="text-primary font-medium">
                    {pool.yield.toFixed(2)}%
                  </span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium text-foreground">
                My deposit: {pool.myDeposit} {pool.assetA}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 gap-8 items-stretch">
          {/* Tabs for Supply, Borrow, Info */}
          <Tabs defaultValue="supply" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="supply">Fill</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>

            {/* Supply Tab */}
            <TabsContent value="supply" className="mt-6">
              <Card className="p-6 h-full flex flex-col">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Supply amount:
                    </label>
                    <div className="relative">
                      <Input
                        value={supplyAmount}
                        onChange={(e) => setSupplyAmount(e.target.value)}
                        className="pr-20 h-12 text-lg"
                        placeholder="0"
                      />
                      <Button
                        variant="outline"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
                      >
                        MAX
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Balance: 0 {pool.assetA}
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-foreground">Supply</span>
                      <span className="font-semibold text-foreground">
                        +{supplyAmount || "0.00"} {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">Yield</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary font-semibold">
                          {pool.yield.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">
                        Collateral (deposit)
                      </span>
                      <span className="font-semibold text-foreground">
                        0.00 {pool.assetB}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Borrow Token</span>
                      <span className="font-semibold text-foreground">
                        {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Collateral Token</span>
                      <span className="font-semibold text-foreground">
                        {pool.assetB}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Borrow Amount</span>
                      <span className="font-semibold text-foreground">
                        0.00 {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Interest (%)</span>
                      <span className="font-semibold text-foreground">
                        0.00%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Duration</span>
                      <span className="font-semibold text-foreground">
                        0 days
                      </span>
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-medium rounded-xl">
                    Fill
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="mt-6">
              <Card className="p-6 h-full flex flex-col">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">Liquidity</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">
                        {pool.liquidity} {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">Yield</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-primary font-semibold">
                        {pool.yield.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">
                        Collateral (deposit)
                      </span>
                      <span className="font-semibold text-foreground">
                        0.00 {pool.assetB}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Borrow Token</span>
                      <span className="font-semibold text-foreground">
                        {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Collateral Token</span>
                      <span className="font-semibold text-foreground">
                        {pool.assetB}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Borrow Amount</span>
                      <span className="font-semibold text-foreground">
                        0.00 {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Interest (%)</span>
                      <span className="font-semibold text-foreground">
                        0.00%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Duration</span>
                      <span className="font-semibold text-foreground">
                        0 days
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Section - Loan History */}
        <div className="mt-8">
          <Tabs
            value={historyTab}
            onValueChange={setHistoryTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-1 rounded-xl max-w-md">
              <TabsTrigger value="loan-history">Loan History</TabsTrigger>
            </TabsList>

            <TabsContent value="loan-history" className="mt-6">
              <Card className="overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground">
                    <div>Loan History</div>
                    <div>Amount</div>
                    <div>APR</div>
                    <div>Date</div>
                    <div>Status</div>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {LOAN_HISTORY.map((loan, idx) => (
                    <div
                      key={idx}
                      className="p-6 grid grid-cols-5 gap-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        setSelectedLoan({
                          id: loan.id,
                          amount: loan.amount,
                          borrowAmount: loan.borrowAmount,
                          apr: loan.apr,
                          date: loan.date,
                          status: loan.status,
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{loan.id}</span>
                        <span className="font-medium text-foreground">
                          {loan.amount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">
                          {loan.borrowAmount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">
                          {loan.apr.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-foreground">{loan.date}</div>
                      <div>
                        <Badge
                          className={`rounded-full ${
                            loan.status === "On time"
                              ? "bg-primary/20 text-primary hover:bg-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {loan.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
