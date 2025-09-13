"use client";

import { Brain, Zap, Shield, TrendingUp, Layers } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Adaptive Learning",
    description: "Improves over time based on real-world interactions.",
  },
  {
    icon: Zap,
    title: "Seamless Integration",
    description: "Works with your favorite tools and platforms.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Keeps your data protected with top-tier encryption.",
  },
  {
    icon: TrendingUp,
    title: "Scalability",
    description:
      "Whether you're a startup or an enterprise, Axios grows with you.",
  },
  {
    icon: Layers,
    title: "Intuitive Interface",
    description: "No complex coding required—just powerful results.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="max-w-[1312px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-caption text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4 text-white">
            Why Choose Axios
          </p>
          <h2 className="heading-lg md:heading-md lg:heading-lg text-white px-2">
            Fixed-Rate Credit,
            <br />
            Built on Fuel
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 items-stretch">
          {/* First Row - 3 Cards (each takes 2 columns) */}
          <div className="md:col-span-2 rounded-2xl p-6 pb-8 md:p-8 md:pb-10 text-center hover:bg-accent transition-all duration-300 md:min-h-[367px] h-full flex flex-col bg-muted/20 border border-border/20">
            <div className="w-full h-[168px] mb-4 grid place-items-center">
              <img
                src="/CardHeader1.svg"
                alt="Fixed Rate & Duration"
                className="max-w-full max-h-full translate-x-4 md:translate-x-6"
                style={{
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
            <h3 className="heading-sm md:heading-sm lg:heading-md text-white mb-2">
              Fixed Rate & Duration
            </h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Set clear terms—rate and duration locked at execution.
            </p>
          </div>

          <div className="md:col-span-2 rounded-2xl p-6 pb-8 md:p-8 md:pb-10 text-center hover:bg-accent transition-all duration-300 md:min-h-[367px] h-full flex flex-col bg-muted/20 border border-border/20">
            <div className="w-full h-[168px] mb-4 grid place-items-center">
              <img
                src="/CardHeader2.svg"
                alt="Fuel-Native Performance"
                className="max-w-full max-h-full translate-x-4 md:translate-x-6"
                style={{
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
            <h3 className="heading-sm md:heading-sm lg:heading-md text-white mb-2">
              Fuel-Native Performance
            </h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              High-throughput orderbook matching powered by Fuel.
            </p>
          </div>

          <div className="md:col-span-2 rounded-2xl p-6 pb-8 md:p-8 md:pb-10 text-center hover:bg-accent transition-all duration-300 md:min-h-[367px] h-full flex flex-col bg-muted/20 border border-border/20">
            <div className="w-full h-[168px] mb-4 grid place-items-center">
              <img
                src="/CardHeader3.svg"
                alt="Institutional Grade"
                className="max-w-full max-h-full translate-x-4 md:translate-x-6"
                style={{
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
            <h3 className="heading-sm md:heading-sm lg:heading-md text-white mb-2">
              Institutional Grade
            </h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              KYC-ready flows and robust access controls for institutions.
            </p>
          </div>

          {/* Second Row - 2 Cards (each takes 3 columns) */}
          <div className="md:col-span-3 rounded-2xl p-6 pb-8 md:p-8 md:pb-10 text-center hover:bg-accent transition-all duration-300 md:min-h-[367px] h-full flex flex-col bg-muted/20 border border-border/20">
            <div className="w-full h-[168px] mb-4 grid place-items-center">
              <img
                src="/CardHeader4.svg"
                alt="Passive Fixed-Rate Vaults"
                className="max-w-full max-h-full translate-x-4 md:translate-x-7"
                style={{
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
            <h3 className="heading-sm md:heading-sm lg:heading-md text-white mb-2">
              Passive Fixed-Rate Vaults
            </h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Vaults automate order matching—deposit to earn predictable yield.
            </p>
          </div>

          <div className="md:col-span-3 rounded-2xl p-6 pb-8 md:p-8 md:pb-10 text-center hover:bg-accent transition-all duration-300 md:min-h-[367px] h-full flex flex-col bg-muted/20 border border-border/20">
            <div className="w-full h-[168px] mb-4 grid place-items-center">
              <img
                src="/CardHeader5.svg"
                alt="Advanced Risk Management"
                className="max-w-full max-h-full translate-x-4 md:translate-x-7"
                style={{
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
            <h3 className="heading-sm md:heading-sm lg:heading-md text-white mb-2">
              Advanced Risk Management
            </h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Time-based expiries and automated liquidations; fees enforced
              on-chain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
