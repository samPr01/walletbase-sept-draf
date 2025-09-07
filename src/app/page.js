'use client';

import Link from 'next/link';
import styles from '../styles/Landing.module.css';
import WalletConnectButton from '../components/WalletConnectButton';
import { useAccount } from 'wagmi';
import { RECEIVING_ADDRESSES } from '../lib/config';
import { fetchBTCBalance, getBTCAddressInfo, isValidBTCAddress } from '../lib/bitcoin';
import { 
  getBitcoinBalance, 
  getTransactionDetails,
  isValidBitcoinAddress as validateBTCAddress,
  isValidBitcoinAddressLenient as validateBTCLenient,
  testBitcoinAddress
} from '../lib/bitcoin-simple';
import {
  executeBitcoinTransfer,
  getAvailableTransferMethods,
  getNetworkFeeRates
} from '../lib/bitcoin-transactions';
import {
  getUSDTBalance,
  getUSDCBalance,
  transferUSDT,
  transferUSDC,
  getTokenInfo
} from '../lib/usdt-transactions';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import QRCode from 'qrcode';
import { 
  createUser, 
  getUserByAddress, 
  updateUserActivity, 
  createDeposit, 
  createWithdrawal,
  createTransaction 
} from '../lib/enhanced-user-management';
import { useUser } from '../contexts/UserContext';
import Navigation from '../components/Navigation';

// ✅ NEW IMPORT
import { getProvider, getSigner } from "../utils/wallet-utils";

export default function LandingPage() {
  const { userId, updateUser, clearUser } = useUser();
  const { address: walletAddress, isConnected } = useAccount();
  const [cryptoData, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [isProcessing, setIsProcessing] = useState(false);
  const [balances, setBalances] = useState({
    ETH: '0.0000',
    BTC: '0.00000000',
    USDT: '0.00',
    USDC: '0.00'
  });
  const [usdBalances, setUsdBalances] = useState({
    ETH: 0,
    BTC: 0,
    USDT: 0,
    USDC: 0,
    total: 0
  });
  const [prices, setPrices] = useState({});
  const [lastPriceUpdate, setLastPriceUpdate] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionScreenshot, setTransactionScreenshot] = useState(null);
  const [withdrawToAddress, setWithdrawToAddress] = useState('');
  const [transferMethod, setTransferMethod] = useState('server-side');
  const [availableTransferMethods, setAvailableTransferMethods] = useState([]);
  const [networkFeeRates, setNetworkFeeRates] = useState({ low: 5000, medium: 10000, high: 20000 });
  const [selectedFeeRate, setSelectedFeeRate] = useState('medium');

  // (unchanged code above …)

  const handleDeposit = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsProcessing(true);
    try {
      if (selectedToken === 'ETH') {
        const signer = await getSigner(); // ✅ FIXED
        if (!signer) throw new Error('Wallet not connected');

        const amountInWei = ethers.parseEther(depositAmount);
        const tx = { to: walletAddress, value: amountInWei };

        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();

        alert(`ETH deposit successful! Transaction hash: ${transaction.hash}`);

        await createTransaction(userId, walletAddress, 'ETH', 'deposit', depositAmount, transaction.hash);

        const provider = getProvider();
        if (provider) {
          const newEthBalance = await provider.getBalance(walletAddress);
          const ethBalanceFormatted = ethers.formatEther(newEthBalance);
          setBalances(prev => ({
            ...prev,
            ETH: parseFloat(ethBalanceFormatted).toFixed(4)
          }));
        }
      } else if (selectedToken === 'BTC') {
        // (unchanged BTC code …)
      } else if (selectedToken === 'USDT') {
        const signer = await getSigner(); // ✅ FIXED
        if (!signer) throw new Error('Wallet not connected');
        const provider = getProvider();
        if (!provider) throw new Error('Provider not available');

        const depositAddress = RECEIVING_ADDRESSES.USDT;
        const result = await transferUSDT(walletAddress, depositAddress, depositAmount, signer);

        alert(`USDT deposit successful! Transaction Hash: ${result.txHash}`);

        await createTransaction(userId, walletAddress, 'USDT', 'deposit', depositAmount, result.txHash);

        const newBalance = await getUSDTBalance(walletAddress, provider);
        setBalances(prev => ({ ...prev, USDT: newBalance.toFixed(2) }));
      } else if (selectedToken === 'USDC') {
        const signer = await getSigner(); // ✅ FIXED
        if (!signer) throw new Error('Wallet not connected');
        const provider = getProvider();
        if (!provider) throw new Error('Provider not available');

        const depositAddress = RECEIVING_ADDRESSES.USDT;
        const result = await transferUSDC(walletAddress, depositAddress, depositAmount, signer);

        alert(`USDC deposit successful! Transaction Hash: ${result.txHash}`);

        await createTransaction(userId, walletAddress, 'USDC', 'deposit', depositAmount, result.txHash);

        const newBalance = await getUSDCBalance(walletAddress, provider);
        setBalances(prev => ({ ...prev, USDC: newBalance.toFixed(2) }));
      }

      setShowDepositModal(false);
      setDepositAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
      alert(`Deposit failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsProcessing(true);
    try {
      if (selectedToken === 'ETH') {
        const signer = await getSigner(); // ✅ FIXED
        if (!signer) throw new Error('Wallet not connected');

        const amountInWei = ethers.parseEther(withdrawAmount);
        const tx = { to: withdrawToAddress.trim(), value: amountInWei };

        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();

        alert(`ETH withdrawal successful! Transaction hash: ${transaction.hash}`);

        await createTransaction(userId, walletAddress, 'ETH', 'withdrawal', withdrawAmount, transaction.hash);

        const provider = getProvider();
        if (provider) {
          const newEthBalance = await provider.getBalance(walletAddress);
          const ethBalanceFormatted = ethers.formatEther(newEthBalance);
          setBalances(prev => ({
            ...prev,
            ETH: parseFloat(ethBalanceFormatted).toFixed(4)
          }));
        }
      } else if (selectedToken === 'BTC') {
        // (unchanged BTC code …)
      } else if (selectedToken === 'USDT') {
        const signer = await getSigner(); // ✅ FIXED
        if (!signer) throw new Error('Wallet not connected');
        const provider = getProvider();
        if (!provider) throw new Error('Provider not available');

        const result = await transferUSDT(RECEIVING_ADDRESSES.USDT, withdrawToAddress.trim(), withdrawAmount, signer);

        alert(`USDT withdrawal successful! Transaction Hash: ${result.txHash}`);

        await createTransaction(userId, walletAddress, 'USDT', 'withdrawal', withdrawAmount, result.txHash);

        const newBalance = await getUSDTBalance(walletAddress, provider);
        setBalances(prev => ({ ...prev, USDT: newBalance.toFixed(2) }));
      } else if (selectedToken === 'USDC') {
        const signer = await getSigner(); // ✅ FIXED
        if (!signer) throw new Error('Wallet not connected');
        const provider = getProvider();
        if (!provider) throw new Error('Provider not available');

        const result = await transferUSDC(RECEIVING_ADDRESSES.USDT, withdrawToAddress.trim(), withdrawAmount, signer);

        alert(`USDC withdrawal successful! Transaction Hash: ${result.txHash}`);

        await createTransaction(userId, walletAddress, 'USDC', 'withdrawal', withdrawAmount, result.txHash);

        const newBalance = await getUSDCBalance(walletAddress, provider);
        setBalances(prev => ({ ...prev, USDC: newBalance.toFixed(2) }));
      }

      setShowWithdrawModal(false);
      setWithdrawAmount('');
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert(`Withdrawal failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // (rest of your component remains unchanged …)
}
