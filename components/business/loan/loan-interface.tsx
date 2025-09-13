"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function LoanInterface() {
  const [borrowAmountInput, setBorrowAmountInput] = useState<string>("");
  const [borrowAsset, setBorrowAsset] = useState<"eth" | "usdc" | "">("");
  const [collateralAsset, setCollateralAsset] = useState<
    "fuel" | "eth" | "usdc"
  >("fuel");

  const PRICES_USD: Record<string, number> = {
    eth: 4200,
    usdc: 1,
    fuel: 0.007871,
  };

  const COLLATERAL_RATIO = 0.75;

  const parsedBorrowAmount = useMemo(() => {
    const n = Number(borrowAmountInput);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [borrowAmountInput]);

  const borrowValueUsd = useMemo(() => {
    if (!borrowAsset) return 0;
    const price = PRICES_USD[borrowAsset];
    return parsedBorrowAmount * price;
  }, [parsedBorrowAmount, borrowAsset]);

  const collateralNeededUnits = useMemo(() => {
    const price = PRICES_USD[collateralAsset];
    if (price <= 0) return 0;
    return borrowValueUsd / (price * COLLATERAL_RATIO);
  }, [borrowValueUsd, collateralAsset]);

  const displaySymbol: Record<typeof collateralAsset, string> = {
    fuel: "$FUEL",
    eth: "ETH",
    usdc: "USDC",
  } as const;

  const formattedCollateralNeeded = useMemo(() => {
    if (!Number.isFinite(collateralNeededUnits) || collateralNeededUnits <= 0)
      return 0;
    if (collateralNeededUnits < 0.0001)
      return collateralNeededUnits.toExponential(2);
    return Number(collateralNeededUnits.toFixed(6)).toLocaleString();
  }, [collateralNeededUnits]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setBorrowAmountInput(value);
    }
  };

  return (
    <section className="py-12 md:py-16 px-6 bg-section text-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-section mb-4">
            Borrow at Your Terms
          </h2>
          <p className="text-lg text-section max-w-2xl mx-auto">
            Set fixed rates and durations, see collateral update instantly
          </p>
        </div>

        <div className="bg-section rounded-2xl border border-section shadow-lg transition-all duration-300 hover:shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <label className="block text-section font-medium text-lg">
                Borrow
              </label>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter amount"
                  className="flex-1 border-section bg-section text-section placeholder:text-section-muted transition-all duration-200 focus:border-primary focus:shadow-sm"
                  value={borrowAmountInput}
                  onChange={handleInputChange}
                  inputMode="decimal"
                />
                <div className="relative">
                  <select
                    value={borrowAsset}
                    onChange={(e) =>
                      setBorrowAsset(e.target.value as "eth" | "usdc")
                    }
                    className="w-32 h-10 rounded-md border border-section bg-section text-section px-3 py-2 pr-8 text-base transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-sm cursor-pointer appearance-none"
                  >
                    <option value="">Asset</option>
                    <option value="eth">ETH</option>
                    <option value="usdc">USDC</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-section pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-section font-medium text-lg">
                Collateral token
              </label>
              <div className="relative">
                <select
                  value={collateralAsset}
                  onChange={(e) =>
                    setCollateralAsset(e.target.value as typeof collateralAsset)
                  }
                  className="w-full h-10 rounded-md border border-section bg-section text-section px-3 py-2 pr-8 text-base transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-sm cursor-pointer appearance-none"
                >
                  <option value="fuel">FUEL</option>
                  <option value="eth">ETH</option>
                  <option value="usdc">USDC</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-section pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="border-t border-section pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2">
                <p className="text-section text-sm text-section-muted">
                  Collateral token amount. Estimation Only
                </p>
                <p className="text-2xl font-light text-section transition-all duration-300">
                  {formattedCollateralNeeded} {displaySymbol[collateralAsset]}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <Link href="/borrow" className="flex items-center">
                  Start borrowing
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
