import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from '../contexts/UserContext';
import { Web3Provider } from '../contexts/Web3Provider';
import '../app/globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'WeWallet - Secure Cryptocurrency Wallet',
  description: 'A modern, secure, and user-friendly cryptocurrency wallet for managing your digital assets.',
  keywords: 'cryptocurrency, wallet, bitcoin, ethereum, blockchain, DeFi',
  authors: [{ name: 'WeWallet Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Web3Provider>
          <UserProvider>
            {children}
          </UserProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
