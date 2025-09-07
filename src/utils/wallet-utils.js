"use client";
import { usePublicClient, useWalletClient } from "wagmi";
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

/**
 * Hook to get the provider (read-only blockchain access).
 */
export function useProvider() {
  return usePublicClient();
}

/**
 * Hook to get the signer (requires wallet connection).
 */
export function useSigner() {
  const { data: walletClient } = useWalletClient();
  return walletClient;
}

/**
 * Get a public client for reading blockchain data.
 * This can be used in regular functions.
 */
export function getProvider() {
  return createPublicClient({
    chain: mainnet,
    transport: http()
  });
}

/**
 * Get signer - this should be called from components using the hook.
 * For now, return null to prevent errors.
 */
export async function getSigner() {
  return null;
}
