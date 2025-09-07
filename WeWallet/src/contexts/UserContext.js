'use client';

import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const updateUser = (newUserId, newWalletAddress) => {
    setUserId(newUserId);
    setWalletAddress(newWalletAddress);
  };

  const clearUser = () => {
    setUserId(null);
    setWalletAddress(null);
  };

  return (
    <UserContext.Provider value={{
      userId,
      walletAddress,
      updateUser,
      clearUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
