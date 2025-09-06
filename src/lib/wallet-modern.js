// Modern Wallet Connection using Web3Modal v4 and Wagmi
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

// Simple wallet connection hook
export function useWalletConnection() {
  const { address, isConnected, isConnecting } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()

  const connectWallet = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Wallet connection failed:', error)
      throw error
    }
  }

  const disconnectWallet = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Wallet disconnection failed:', error)
      throw error
    }
  }

  return {
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet
  }
}

// Legacy compatibility functions for existing code
export const connectWallet = async () => {
  // This will be handled by the Web3Modal component
  throw new Error('Use useWalletConnection hook instead')
}

export const disconnectWallet = async () => {
  // This will be handled by the Web3Modal component
  throw new Error('Use useWalletConnection hook instead')
}

export const detectWallets = () => {
  // Web3Modal handles wallet detection automatically
  return []
}

export const WALLET_TYPES = {
  METAMASK: 'metamask',
  WALLETCONNECT: 'walletconnect',
  COINBASE: 'coinbase',
  TRUST: 'trust',
  BRAVE: 'brave',
  PHANTOM: 'phantom',
  BINANCE: 'binance'
}

// Cookie utilities (keep for session persistence)
const setCookie = (name, value, days = 7) => {
  if (typeof window === 'undefined') return;
  
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  } catch (error) {
    console.warn('Failed to set cookie:', error);
  }
};

const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  } catch (error) {
    console.warn('Failed to get cookie:', error);
  }
  
  return null;
};

const deleteCookie = (name) => {
  if (typeof window === 'undefined') return;
  
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  } catch (error) {
    console.warn('Failed to delete cookie:', error);
  }
};

// Save wallet connection to cookies
export const saveWalletConnection = (walletType, address) => {
  setCookie('walletbase_wallet_type', walletType, 7);
  setCookie('walletbase_wallet_address', address, 7);
};

// Load wallet connection from cookies
export const loadWalletConnection = () => {
  const walletType = getCookie('walletbase_wallet_type');
  const address = getCookie('walletbase_wallet_address');
  
  if (walletType && address) {
    return { walletType, address };
  }
  
  return null;
};

// Clear wallet connection from cookies
export const clearWalletConnection = () => {
  deleteCookie('walletbase_wallet_type');
  deleteCookie('walletbase_wallet_address');
};

// Placeholder functions for compatibility
export const getProvider = () => null;
export const getSigner = () => null;
export const setupWalletListeners = () => {};
export const removeWalletListeners = () => {};
export const restoreWalletFromCookies = async () => null;
export const loadWalletFromCookies = () => null;
