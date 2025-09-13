import type { Metadata } from "next";
import "./globals.css";
import { Providers as WalletProviders } from "@/components/business/wallet/Provider";
import Providers from "./providers";
import SmoothScrollProvider from "@/components/shared/smooth-scroll-provider";

export const metadata: Metadata = {
  title: "Axios",
  description:
    " Axios enables fixed rate fixed duration loans for all users on fuel ignition chain",
  generator:
    "Axios is defi borrow and lend protocol that powers fixed rate fix duration loans",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className="transition-all duration-300"
      >
        <Providers>
          <SmoothScrollProvider>
            <WalletProviders>
              <div className="min-h-screen flex flex-col axios-gradient-bg">
                {children}
              </div>
            </WalletProviders>
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  );
}
