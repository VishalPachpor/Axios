"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FixedRateSection() {
  return (
    <section className="py-16 md:py-20 bg-white text-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content Block */}
          <div className="space-y-6 text-left">
            <div className="space-y-4">
              <p className="text-caption text-black uppercase tracking-wider">
                Fixed-Rate Lending
              </p>
              <h2 className="heading-lg md:heading-md lg:heading-lg text-black leading-tight">
                DeFi Credit That&apos;s
                <br />
                Actually Predictable
              </h2>
            </div>
          </div>

          {/* Right Content Block */}
          <div className="space-y-8 text-left">
            <p className="text-base text-black leading-relaxed max-w-lg">
              Most crypto lending uses floating rates—unpredictable costs for
              borrowers, unstable yields for lenders. We&apos;re building the
              first fixed-rate, fixed-duration lending protocol on Fuel that
              makes DeFi credit as predictable as traditional finance.
            </p>

            {/* Key Benefits */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div>
                  <p className="heading-sm text-black mb-1">Fixed Terms</p>
                  <p className="text-base text-gray-600">
                    Rate and duration locked at execution
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div>
                  <p className="heading-sm text-black mb-1">Multi-Collateral</p>
                  <p className="text-base text-gray-600">
                    Borrow against ETH, USDC, or entire portfolios
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div>
                  <p className="heading-sm text-black mb-1">
                    Institutional Ready
                  </p>
                  <p className="text-base text-gray-600">
                    KYC compliance and robust access controls
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border border-black text-black hover:text-black hover:bg-transparent hover:border-primary transition-all duration-300 rounded-xl h-12 px-6"
              >
                <Link href="/lend">Create Loan Offer</Link>
              </Button>

              <Link
                href="/borrow"
                className="flex items-center gap-2 text-black font-medium hover:text-primary transition-colors duration-300 group"
              >
                <span className="text-base">Browse Loan Requests</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
