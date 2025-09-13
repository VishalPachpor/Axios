"use client";

import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type LendDetailProps = {
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

// Sample loan history data for lending
const LEND_HISTORY = [
  {
    id: "#4189",
    amount: "0.00",
    yield: 0.0,
    date: "00/00/00",
    status: "Active",
  },
  {
    id: "#4185",
    amount: "0.00",
    yield: 0.0,
    date: "00/00/00",
    status: "Completed",
  },
];

export default function LendDetail({ pool, onBack }: LendDetailProps) {
  const [supplyAmount, setSupplyAmount] = useState("0");
  const [activeTab, setActiveTab] = useState("fill");

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b border-border px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-foreground">
                  Lend {pool.assetA} against {pool.assetB}
                </span>
                <span className="text-foreground">|</span>
                <span className="text-lg text-foreground">
                  Yield:{" "}
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 items-stretch">
          {/* Tabs for Fill and Info */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="fill">Lend</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>

            {/* Fill Tab */}
            <TabsContent
              value="fill"
              className="mt-6 h-[560px] overflow-y-auto"
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Lend amount:
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
                      <span className="text-foreground">Lend</span>
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
                      <span className="text-foreground">Collateral Token</span>
                      <span className="font-semibold text-foreground">
                        {pool.assetB}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Lend Token</span>
                      <span className="font-semibold text-foreground">
                        {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Loan Term</span>
                      <span className="font-semibold text-foreground">
                        7 Days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">
                        Liquidation Threshold
                      </span>
                      <span className="font-semibold text-foreground">80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Liquidation Bonus</span>
                      <span className="font-semibold text-foreground">
                        5.00%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Protocol Fee</span>
                      <span className="font-semibold text-foreground">
                        0.00%
                      </span>
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-medium rounded-xl">
                    Lend
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent
              value="info"
              className="mt-6 h-[560px] overflow-y-auto"
            >
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
                      <span className="text-foreground">Total Debt</span>
                      <span className="font-semibold text-foreground">
                        {pool.debt} {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Collateral Token</span>
                      <span className="font-semibold text-foreground">
                        {pool.assetB}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Lend Token</span>
                      <span className="font-semibold text-foreground">
                        {pool.assetA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Loan Term</span>
                      <span className="font-semibold text-foreground">
                        7 Days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">
                        Liquidation Threshold
                      </span>
                      <span className="font-semibold text-foreground">80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Liquidation Bonus</span>
                      <span className="font-semibold text-foreground">
                        5.00%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Protocol Fee</span>
                      <span className="font-semibold text-foreground">
                        0.00%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Section - Lending History */}
        <div className="mt-8">
          <Tabs defaultValue="lending-history" className="w-full">
            <TabsList className="grid w-full grid-cols-1 rounded-xl max-w-md">
              <TabsTrigger value="lending-history">Lending History</TabsTrigger>
            </TabsList>

            <TabsContent
              value="lending-history"
              className="mt-6 h-[400px] overflow-y-auto"
            >
              <Card className="overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                    <div>Lending History</div>
                    <div>Amount</div>
                    <div>Yield</div>
                    <div>Status</div>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {LEND_HISTORY.map((lend, idx) => (
                    <div
                      key={idx}
                      className="p-6 grid grid-cols-4 gap-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{lend.id}</span>
                        <span className="font-medium text-foreground">
                          {lend.amount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{lend.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">
                          {lend.yield.toFixed(2)}%
                        </span>
                      </div>
                      <div>
                        <Badge
                          className={`rounded-full ${
                            lend.status === "Active"
                              ? "bg-primary/20 text-primary hover:bg-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {lend.status}
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
