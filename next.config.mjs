/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Allow Next.js dev assets to be loaded from ngrok origin during development
    // This prevents cross-origin warnings for /_next/* when accessing via tunnel
    allowedDevOrigins: ["https://*.ngrok-free.app"],
  },
  // Improve asset handling
  assetPrefix: process.env.NODE_ENV === "production" ? undefined : "",
  webpack: (config, { dev, isServer }) => {
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    // https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Improve CSS handling in development
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**"],
      };
    }

    return config;
  },
};

export default nextConfig;
