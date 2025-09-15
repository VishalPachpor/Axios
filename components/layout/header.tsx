"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Wallet, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/components/ui/use-mobile";

import React from "react";

// Lazy load the wallet component to prevent blocking navbar render
const WalletAction = dynamic(() => import("../business/wallet/walletAction"), {
  ssr: false,
  loading: () => (
    <Button variant="outline" className="h-10 px-4 animate-pulse">
      <div className="h-4 w-20 bg-muted rounded" />
    </Button>
  ),
});

// Custom hook to detect scroll position and determine logo color
function useLogoColor() {
  const [logoColor, setLogoColor] = useState("white");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Get the element at the current scroll position
      const elements = document.elementsFromPoint(
        window.innerWidth / 2,
        scrollY + 100
      );

      // Check if we're over a white/light background section
      let shouldUseDarkLogo = false;

      for (const element of elements) {
        if (element instanceof HTMLElement) {
          const computedStyle = window.getComputedStyle(element);
          const backgroundColor = computedStyle.backgroundColor;
          const sectionClass = element.className || "";

          // Check for white backgrounds or specific section classes
          if (
            backgroundColor.includes("255, 255, 255") ||
            backgroundColor.includes("rgb(255, 255, 255)") ||
            backgroundColor.includes("white") ||
            sectionClass.includes("bg-white") ||
            sectionClass.includes("bg-section") ||
            element.closest('[class*="bg-white"]') ||
            element.closest('[class*="bg-section"]')
          ) {
            shouldUseDarkLogo = true;
            break;
          }
        }
      }

      setLogoColor(shouldUseDarkLogo ? "black" : "white");
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { logoColor, isScrolled };
}

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logoColor, isScrolled } = useLogoColor();
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/20"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 relative">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center space-x-3 text-foreground hover:text-primary transition-all duration-300"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 41 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.7054 17.7285L11.929 8.95214L9.2761 11.605L18.0047 20.3337L9.2761 29.0623L11.7275 31.5137L20.7054 22.5358L29.6832 31.5137L32.1346 29.0623L23.406 20.3337L32.1346 11.605L29.4817 8.95214L20.7054 17.7285Z"
              fill={logoColor === "black" ? "#000000" : "hsl(var(--primary))"}
            />
            <path
              d="M13.8881 6.81731L20.7054 -3.8147e-06L27.5227 6.81731L20.7054 13.6346L13.8881 6.81731Z"
              fill={logoColor === "black" ? "#000000" : "hsl(var(--primary))"}
            />
            <path
              d="M27.2001 20.3688L34.0174 13.5515L40.8347 20.3688L34.0174 27.1861L27.2001 20.3688Z"
              fill={logoColor === "black" ? "#000000" : "hsl(var(--primary))"}
            />
            <path
              d="M0 20.3688L6.81732 13.5515L13.6346 20.3688L6.81732 27.1861L0 20.3688Z"
              fill={logoColor === "black" ? "#000000" : "hsl(var(--primary))"}
            />
            <path
              d="M13.8881 33.8675L16.1566 31.599L20.8128 35.962L23.0468 33.6752L20.7591 31.4143L20.7054 27.0502L27.5227 33.8675L20.7054 40.6849L13.8881 33.8675Z"
              fill={logoColor === "black" ? "#000000" : "hsl(var(--primary))"}
            />
          </svg>
          <span
            className={`text-xl font-light tracking-wide transition-colors duration-300 ${
              logoColor === "black" ? "text-black" : "text-white"
            }`}
          >
            AXIOS
          </span>
        </Link>

        {/* Desktop navigation: Home / Lend / Borrow - Centered with segmented control effect */}
        <nav className="hidden md:flex items-center bg-transparent absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="px-2 py-3 gap-1 rounded-[100px] border border-white/[0.08] bg-[#0E0D0C] transition-all duration-300 shadow-lg">
            {/* <Link
              href="/lend"
              className={`px-4 py-2 rounded-[100px] text-sm font-medium transition-all duration-200 ${
                pathname === "/lend"
                  ? "bg-[#282828] text-white shadow-md"
                  : "text-white hover:bg-[#3F3A37] active:bg-[#644437] hover:scale-105"
              }`}
            >
              Lend
            </Link>
            <Link
              href="/borrow"
              className={`px-4 py-2 rounded-[100px] text-sm font-medium transition-all duration-200 ${
                pathname === "/borrow"
                  ? "bg-[#282828] text-white shadow-md"
                  : "text-white hover:bg-[#3F3A37] active:bg-[#644437] hover:scale-105"
              }`}
            >
              Borrow
            </Link>
            <Link
              href="/earn"
              className={`px-4 py-2 rounded-[100px] text-sm font-medium transition-all duration-200 ${
                pathname === "/earn"
                  ? "bg-[#282828] text-white shadow-md"
                  : "text-white hover:bg-[#3F3A37] active:bg-[#644437] hover:scale-105"
              }`}
            >
              Earn
            </Link> */}
          </div>
        </nav>

        {/* Right side: Desktop - Fuel Testnet and Wallet, Mobile - Only Wallet */}
        <div className="flex items-center gap-3">
          {/* Fuel Testnet button - hidden on mobile */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 px-4 bg-background/20 backdrop-blur-md border-border hover:bg-background/30 transition-all duration-300 text-foreground"
                >
                  <span className="font-medium">Fuel Testnet</span>
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>

          {/* Wallet button - always visible */}
          <WalletAction />

          {/* Mobile menu button - only on mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/20 shadow-lg">
          <div className="px-6 py-6">
            {/* Mobile navigation - simple list without rounded backgrounds */}
            <div className="flex flex-col space-y-2">
              
              {/* <Link
                href="/lend"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-sm font-medium text-white transition-colors duration-200"
              >
                Lend
              </Link>
              <Link
                href="/borrow"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-sm font-medium text-white transition-colors duration-200"
              >
                Borrow
              </Link>
              <Link
                href="/earn"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-sm font-medium text-white transition-colors duration-200"
              >
                Earn
              </Link> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
