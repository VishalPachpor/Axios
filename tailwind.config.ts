import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Grid System: 12 col desktop, 8 col tablet, 4 col mobile
      gridTemplateColumns: {
        desktop: "repeat(12, minmax(0, 1fr))",
        tablet: "repeat(8, minmax(0, 1fr))",
        mobile: "repeat(4, minmax(0, 1fr))",
      },
      // Spacing System for Rhythm (8px base unit)
      spacing: {
        xs: "0.5rem", // 8px
        sm: "1rem", // 16px
        md: "1.5rem", // 24px
        lg: "2rem", // 32px
        xl: "3rem", // 48px
        "2xl": "4rem", // 64px
        "3xl": "6rem", // 96px
        "4xl": "8rem", // 128px
      },
      // Typography Scale - Major Third (1.25)
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.5", letterSpacing: "0" }], // 14px
        base: ["1rem", { lineHeight: "1.5", letterSpacing: "0" }], // 16px (p)
        lg: ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.005em" }], // 20px (h6, h5)
        xl: ["1.6rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }], // 25.6px (h4)
        "2xl": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }], // 32px (h3)
        "3xl": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }], // 40px (h2)
        "4xl": ["3.125rem", { lineHeight: "1", letterSpacing: "-0.02em" }], // 50px (h1)
        "5xl": ["3.906rem", { lineHeight: "0.95", letterSpacing: "-0.025em" }], // 62.5px
        "6xl": ["4.883rem", { lineHeight: "0.9", letterSpacing: "-0.03em" }], // 78.125px
        "7xl": ["6.104rem", { lineHeight: "0.85", letterSpacing: "-0.035em" }], // 97.656px
        "8xl": ["7.629rem", { lineHeight: "0.8", letterSpacing: "-0.04em" }], // 122.07px
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom theme colors
        surface: {
          primary: "hsl(var(--surface-primary))",
          secondary: "hsl(var(--surface-secondary))",
          tertiary: "hsl(var(--surface-tertiary))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
        },
        theme: {
          green: "hsl(var(--accent-green))",
          blue: "hsl(var(--accent-purple))",
          purple: "hsl(var(--accent-purple))",
          orange: "#DE6635" /* Updated to new orange */,
        },
        // Custom brown colors based on new orange theme
        "dark-brown": "#2D1A0F" /* Updated to match new orange theme */,
        "custom-brown": {
          900: "#2D1A0F" /* Dark brown based on new orange */,
          800: "#3E2218" /* Medium brown based on new orange */,
          700: "#4F2A21" /* Light brown based on new orange */,
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
