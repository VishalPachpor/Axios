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

        // Initialize Lenis with minimal options
        lenisRef.current = new Lenis();

        // RAF loop for smooth scrolling
        function raf(time: number) {
          lenisRef.current?.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
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
