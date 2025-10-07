"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LiquidEther from "@/components/ui/liquid-ether";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* LiquidEther Background - Full screen coverage */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <LiquidEther
          colors={["#5227FF", "#fa7214", "#ffac14"]}
          mouseForce={18}
          cursorSize={105}
          isViscous={false}
          viscous={25}
          iterationsViscous={24}
          iterationsPoisson={24}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.6}
          autoIntensity={2.2}
          takeoverDuration={0.4}
          autoResumeDelay={2000}
          autoRampDuration={0.8}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-6xl mx-auto w-full px-4 md:px-6 pointer-events-none">
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-8 md:mb-10 leading-[0.85] tracking-tight">
          Fixed-Rate
          <br />
          Borrow & Lend on Fuel
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Predictable borrowing costs and steady yields.
          <br className="hidden sm:block" />
          Fixed-rate, fixed-duration credit—built natively on Fuel.
        </p>

        {/* Join Waitlist CTA Button */}
        <div className="flex justify-center items-center mb-6 md:mb-10 pointer-events-auto">
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-w-64"
          >
            <Link href="/waitlist">
              Join the Waitlist
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
