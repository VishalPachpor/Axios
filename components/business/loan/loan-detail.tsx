"use client";

import { ArrowLeft, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type LoanDetailProps = {
  loan: {
    id: string;
    amount: string;
    borrowAmount: string;
    apr: number;
    date: string;
    status: string;
  };
  onBack: () => void;
};

// Sample loan activity data
const LOAN_ACTIVITY = [
  {
    status: "Funded",
    date: "08/08/25",
    principal: "-",
    interest: "-",
    outstanding: "6.59K USDC",
    transaction: "0x3eba...001",
  },
];

export default function LoanDetail({ loan, onBack }: LoanDetailProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2 hover:bg-accent transition-smooth"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
            <span className="text-muted-foreground font-medium">Back</span>
          </div>

          <div className="mb-8">
            <h1 className="heading-lg font-light text-foreground mb-2">
              Loan {loan.id}:
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {loan.status}
              </span>
            </h1>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Amount Card */}
            <Card className="p-6 glass-effect border-border hover:border-primary/30 transition-smooth">
              <div className="text-3xl font-light text-foreground mb-2">
                {loan.borrowAmount} USDC
              </div>
              <div className="text-muted-foreground mb-2">
                Requested by{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition-smooth inline-flex items-center gap-1 font-medium"
                >
                  0xc3...937 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>

            {/* APY Card */}
            <Card className="p-6 glass-effect border-border hover:border-primary/30 transition-smooth">
              <div className="text-3xl font-light text-primary mb-2">
                {loan.apr.toFixed(2)} %
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>APY (fixed)</span>
                <Info className="w-4 h-4" />
              </div>
            </Card>

            {/* Collateral Card */}
            <Card className="p-6 glass-effect border-border hover:border-primary/30 transition-smooth">
              <div className="text-3xl font-light text-foreground mb-2 inline-flex items-center gap-2">
                21.89K SPX
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-medium">
                    S
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Collateral</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          {/* Right Side - Loan Details */}
          <div>
            <Card className="p-6 glass-effect border-border">
              <h2 className="heading-md font-light text-foreground mb-6">
                Loan details
              </h2>

              <div className="grid grid-cols-2 gap-8">
                {/* Terms Column */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Terms</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Amount</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">
                        {loan.borrowAmount} USDC
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">APY</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-primary">
                        {loan.apr.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Duration</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">
                        30 days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Payment cycle
                        </span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">
                        30 days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Due date</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">
                        09/07/25
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pending Payments Column */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      Pending Payments (1)
                    </h3>
                    <span className="text-sm text-muted-foreground">Due</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">
                        6.92K USDC
                      </span>
                      <span className="text-sm text-muted-foreground">
                        09/07/25
                      </span>
                    </div>
                    <div className="mt-6">
                      <div className="text-2xl font-light text-primary mb-1">
                        {loan.apr.toFixed(2)}%
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-sm">Projected earnings</span>
                        <Info className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Loan is up for liquidation in:{" "}
                <span className="font-medium text-destructive">
                  26 days • 17 hrs • 22 mins • 15 secs
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Loan Activity Section */}
        <div className="mt-12">
          <h2 className="heading-md font-light text-foreground mb-6">
            Loan activity
          </h2>

          <Card className="overflow-hidden glass-effect border-border">
            <div className="p-6 border-b border-border">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Status</span>
                  <Info className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span>Date</span>
                  <Info className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span>Principal</span>
                  <Info className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span>Interest</span>
                  <Info className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span>Outstanding</span>
                  <Info className="w-4 h-4" />
                </div>
                <div>Transaction</div>
              </div>
            </div>
            <div className="divide-y">
              {LOAN_ACTIVITY.map((activity, idx) => (
                <div
                  key={idx}
                  className="p-6 grid grid-cols-6 gap-4 hover:bg-accent/50 transition-smooth"
                >
                  <div>
                    <Badge className="bg-muted text-foreground hover:bg-muted border-border">
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="text-foreground">{activity.date}</div>
                  <div className="text-foreground">{activity.principal}</div>
                  <div className="text-foreground">{activity.interest}</div>
                  <div className="text-foreground">{activity.outstanding}</div>
                  <div>
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 transition-smooth inline-flex items-center gap-1 font-medium"
                    >
                      {activity.transaction}{" "}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
