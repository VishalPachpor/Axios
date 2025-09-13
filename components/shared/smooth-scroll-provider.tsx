"use client";

import { useEffect, useRef } from "react";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const initLenis = async () => {
      try {
        const Lenis = (await import("lenis")).default;

        // Initialize Lenis with mobile-optimized options
        lenisRef.current = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
          touchMultiplier: 2, // Increase touch sensitivity for mobile
        });

        // RAF loop for smooth scrolling
        function raf(time: number) {
          lenisRef.current?.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Handle resize events for mobile orientation changes
        const handleResize = () => {
          if (lenisRef.current) {
            lenisRef.current.resize();
          }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("orientationchange", handleResize);
        };
      } catch (error) {
        console.error("Failed to initialize Lenis:", error);
      }
    };

    initLenis();

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
