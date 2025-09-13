"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export type PairDetailProps = {
  pair: {
    collateralToken: string;
    pair: string; // e.g., "PRIME/USDC" or "PRIME/USDC"
    liquidity: string;
    volume: string;
    apy: number;
  };
  onBack: () => void;
};

const PAIR_LOAN_HISTORY = [
  {
    id: "#4124",
    amount: "114.24K",
    apr: 45.0,
    date: "07/19/25",
    status: "Paid",
    label: "200.00K PRIME",
  },
  {
    id: "#4118",
    amount: "116.91K",
    apr: 45.0,
    date: "07/18/25",
    status: "Paid",
    label: "200.00K PRIME",
  },
  {
    id: "#4103",
    amount: "208.34K",
    apr: 45.0,
    date: "07/15/25",
    status: "Paid",
    label: "373.31K PRIME",
  },
  {
    id: "#4053",
    amount: "104.47K",
    apr: 45.0,
    date: "07/02/25",
    status: "Paid",
    label: "175.00K PRIME",
  },
  {
    id: "#4042",
    amount: "50K",
    apr: 45.0,
    date: "06/30/25",
    status: "Paid",
    label: "92.03K PRIME",
  },
];

export default function PairDetail({ pair, onBack }: PairDetailProps) {
  const [tab, setTab] = useState("borrow");
  const [selectedOffer, setSelectedOffer] = useState<null | {
    q: number;
    p: number;
    d: number;
  }>(null);
  const [depositAmount, setDepositAmount] = useState<string>("1");

  const [base] = pair.pair.includes("/") ? pair.pair.split("/") : [pair.pair]; // e.g., PRIME/USDC

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="text-sm text-primary hover:underline mb-3"
          >
            Back
          </button>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Pair:</span>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background" />
                </div>
                <span className="font-semibold">/</span>
                <span className="text-muted-foreground">as collateral</span>
              </div>
              <div className="text-muted-foreground">
                <span className="mr-2">Loan volume:</span>
                <span className="font-semibold">{pair.volume}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Borrow/Pools */}
        <Card className="p-4 h-full flex flex-col">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 rounded-xl mb-4">
              <TabsTrigger value="borrow">Borrow</TabsTrigger>
              <TabsTrigger value="pools">Pools</TabsTrigger>
            </TabsList>

            <TabsContent
              value="borrow"
              className="space-y-6 h-[560px] overflow-y-auto"
            >
              {/* Token header */}
              <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary" />
                <div>
                  <div className="font-semibold">{base}</div>
                  <div className="text-sm text-muted-foreground">Ethereum</div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
              </Card>

              {/* Offers list view */}
              {!selectedOffer && (
                <>
                  {[
                    { q: 0.56, p: 3.7, d: 30 },
                    { q: 0.52, p: 3.7, d: 30 },
                  ].map((o, i) => (
                    <button
                      key={i}
                      className="w-full text-left"
                      onClick={() => setSelectedOffer(o)}
                    >
                      <div>
                        <div className="grid grid-cols-2 gap-6 items-center">
                          <div className="flex items-center justify-between border rounded-xl px-4 py-2">
                            <span className="text-muted-foreground">
                              Deposit
                            </span>
                            <div className="inline-flex items-center rounded-full border px-3 py-1 font-semibold">
                              1.00
                              <span className="ml-2 rounded-full bg-muted px-2 text-sm">
                                {base}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between border rounded-xl px-4 py-2">
                            <span className="text-muted-foreground">
                              borrow
                            </span>
                            <div className="inline-flex items-center rounded-full border px-3 py-1 font-semibold">
                              {o.q}
                              <span className="ml-2 rounded-full bg-muted px-2 text-sm">
                                USDC
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-6">
                          <div className="rounded-xl bg-muted px-4 py-3 text-foreground">
                            <span className="text-muted-foreground">
                              Interest
                            </span>
                            <div className="text-xl font-semibold">
                              {o.p.toFixed(2)} %
                            </div>
                          </div>
                          <div className="rounded-xl bg-muted px-4 py-3 text-foreground">
                            <span className="text-muted-foreground">
                              Rollover
                            </span>
                            <div className="text-xl font-semibold">
                              {o.d} days
                            </div>
                          </div>
                        </div>
                        {i === 0 ? (
                          <div className="my-6 h-px bg-border" />
                        ) : null}
                      </div>
                    </button>
                  ))}

                  <div className="text-center text-sm text-muted-foreground pt-6">
                    Powered by Teller
                  </div>
                </>
              )}

              {/* Terms view when an offer is selected */}
              {selectedOffer && (
                <div className="space-y-6">
                  <button
                    className="text-sm text-primary hover:underline"
                    onClick={() => setSelectedOffer(null)}
                  >
                    Back
                  </button>

                  <div>
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                      <div className="text-lg font-semibold">Deposit</div>
                      <div className="text-sm">Max: 0.00 {base}</div>
                    </div>
                    <div className="relative">
                      <input
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full h-12 rounded-xl border px-3 pr-28 bg-muted"
                        inputMode="decimal"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="inline-flex items-center rounded-full bg-background border px-2 py-1 text-sm font-medium">
                          {base}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative my-4 flex w-full items-center justify-center">
                    <div className="h-px w-full bg-border" />
                    <div className="absolute grid place-items-center h-9 w-9 rounded-full border bg-background text-muted-foreground">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  {(() => {
                    const deposit = Number(depositAmount) || 0;
                    const borrow = deposit * selectedOffer.q;
                    const interest = (borrow * 0.04).toFixed(2);
                    const fees = (borrow * 0.02).toFixed(2);
                    return (
                      <>
                        <div>
                          <div className="flex items-center justify-between text-muted-foreground mb-2">
                            <div className="text-lg font-semibold">Borrow</div>
                            <div className="text-sm">
                              Rollover every {selectedOffer.d} days
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              value={borrow.toFixed(6)}
                              readOnly
                              className="w-full h-12 rounded-xl border px-3 pr-28 bg-muted"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <span className="inline-flex items-center rounded-full bg-background border px-2 py-1 text-sm font-medium">
                                USDC
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center text-muted-foreground">
                          Interest: {interest} USDC • Fees: {fees} USDC
                        </div>

                        <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                          Accept terms
                        </Button>

                        <div className="text-center text-sm text-muted-foreground pt-6">
                          Powered by Teller
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pools" className="h-[560px] overflow-y-auto">
              <div className="space-y-4">
                <Card className="p-4 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-9 h-9 rounded-full bg-primary border-2 border-background" />
                    <div className="w-9 h-9 rounded-full bg-secondary border-2 border-background" />
                  </div>
                  <div className="font-semibold">USDC / {base}</div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <div className="ml-auto text-muted-foreground text-sm">
                    APR: {pair.apy.toFixed(0)}% • {pair.liquidity} USDC
                  </div>
                </Card>
              </div>
              <div className="text-center text-sm text-muted-foreground pt-10">
                Powered by Teller
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Right: Loan history table */}
        <Card className="overflow-hidden h-full">
          <div className="p-4 border-b grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground">
            <div>Loan History</div>
            <div>Amount</div>
            <div>APR</div>
            <div>Date</div>
            <div>Status</div>
          </div>
          <div className="divide-y">
            {PAIR_LOAN_HISTORY.map((row) => (
              <div
                key={row.id}
                className="p-4 grid grid-cols-5 gap-4 items-center hover:bg-muted/50"
              >
                <div className="text-foreground">{row.id}</div>
                <div className="text-foreground">
                  {row.amount} <span className="text-xs">USDC</span>
                </div>
                <div className="text-foreground">{row.apr.toFixed(2)}%</div>
                <div className="text-foreground">{row.date}</div>
                <div className="text-foreground">{row.status}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
