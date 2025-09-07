"use client";

import "./globals.css";
import { UserProvider } from "../contexts/UserContext";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../config/web3modal-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
