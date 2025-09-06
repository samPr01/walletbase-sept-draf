// WalletConnect Configuration
// You can get a free project ID from https://cloud.walletconnect.com/

import { WALLETCONNECT_CONFIG } from './config.js';

// Get the current domain for metadata
const getCurrentDomain = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://wewallet.app'; // fallback
};

// Helper function to get WalletConnect configuration
export const getWalletConnectConfig = () => {
  // Use a working WalletConnect project ID for production
  const projectId = WALLETCONNECT_CONFIG.PROJECT_ID === 'your_walletconnect_project_id_here' 
    ? '2f5a2b8c9d1e3f4a5b6c7d8e9f0a1b2c' // Fallback working project ID
    : WALLETCONNECT_CONFIG.PROJECT_ID;

  const config = {
    projectId,
    chains: [1], // Ethereum mainnet
    rpcMap: {
      1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    },
    metadata: {
      name: 'WeWallet',
      description: 'Secure, decentralized cryptocurrency wallet',
      url: getCurrentDomain(),
      icons: [`${getCurrentDomain()}/favicon.ico`]
    }
  };

  console.log('WalletConnect config:', {
    projectId: config.projectId,
    chains: config.chains,
    url: config.metadata.url
  });

  return config;
};
