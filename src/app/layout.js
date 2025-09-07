'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from '../contexts/UserContext';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../lib/web3modal-config';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <title>WeWallet - Secure Cryptocurrency Wallet</title>
        <meta name="description" content="A modern, secure, and user-friendly cryptocurrency wallet for managing your digital assets." />
        <meta name="keywords" content="cryptocurrency, wallet, bitcoin, ethereum, blockchain, DeFi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <UserProvider>
              {children}
            </UserProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
