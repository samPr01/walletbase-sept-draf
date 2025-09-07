'use client';

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { mainnet, arbitrum } from 'wagmi/chains';

// Get projectId from environment variables
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '2f5a2b8c9d1e3f4a5b6c7d8e9f0a1b2c';

// Define the chains your app will work with
const chains = [mainnet, arbitrum];

// Set up the Wagmi config
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'WeWallet',
    description: 'Secure, decentralized cryptocurrency wallet',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://wewallet.app',
    icons: [`${typeof window !== 'undefined' ? window.location.origin : 'https://wewallet.app'}/favicon.ico`]
  }
});

// Create the Web3Modal instance
export const web3Modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
});
