'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useEffect } from 'react'
import { useUser } from '../contexts/UserContext'

export default function WalletConnectButton({ className, children }) {
  const { open } = useWeb3Modal()
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { updateUser, clearUser } = useUser()

  // Generate user ID from address
  const generateUserIdFromAddress = (address) => {
    if (!address) return null;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = '';
    
    // Generate 3 letters based on wallet address
    for (let i = 0; i < 3; i++) {
      const charCode = address.charCodeAt(i + 2) || 0;
      const letterIndex = charCode % letters.length;
      result += letters[letterIndex];
    }
    
    // Generate 3 numbers based on wallet address
    for (let i = 0; i < 3; i++) {
      const charCode = address.charCodeAt(i + 5) || 0;
      const numberIndex = charCode % numbers.length;
      result += numbers[numberIndex];
    }
    
    return result; // Format: AAA000
  };

  // Update user context when wallet connects/disconnects
  useEffect(() => {
    if (isConnected && address) {
      const userId = generateUserIdFromAddress(address);
      updateUser(userId, address);
    } else if (!isConnected) {
      clearUser();
    }
  }, [isConnected, address, updateUser, clearUser]);

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  };

  if (isConnected) {
    return (
      <button 
        onClick={handleDisconnect}
        className={className}
        disabled={isConnecting}
      >
        Disconnect ({address?.slice(0, 6)}...{address?.slice(-4)})
      </button>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      className={className}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : (children || 'Connect Wallet')}
    </button>
  );
}
