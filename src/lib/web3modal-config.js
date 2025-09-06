// Web3Modal v4 Configuration
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '2f5a2b8c9d1e3f4a5b6c7d8e9f0a1b2c'

// 2. Create wagmiConfig
const metadata = {
  name: 'WeWallet',
  description: 'Secure, decentralized cryptocurrency wallet',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://wewallet.app',
  icons: [`${typeof window !== 'undefined' ? window.location.origin : 'https://wewallet.app'}/favicon.ico`]
}

const chains = [mainnet, arbitrum]
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export { projectId, metadata, chains }
