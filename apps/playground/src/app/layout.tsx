import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppProvider from "./components/AppProvider";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@zeus-network/bitcoin-kit-widget/assets/style.css";

import "./globals.css";

const rethinkSans = Rethink_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BitcoinKit Playground",
  description:
    "Instantly add tokenized Bitcoin flows to any website or app—no code, no friction.",
  openGraph: {
    siteName: "BitcoinKit Playground",
    type: "website",
    url: "https://playground.bitcoin-kit.dev",
    title: "Embed BTC Utility with BitcoinKit",
    description:
      "Instantly add tokenized Bitcoin flows to any website or app—no code, no friction.",
    images: [
      {
        url: "graphics/og-image.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rethinkSans.variable} antialiased`}>
        <div className="wrapper flex flex-col gap-y-64 lg:gap-y-64">
          <AppProvider>
            <Header />
            {children}
            <Footer />
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
