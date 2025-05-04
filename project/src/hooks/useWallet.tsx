import { useState, useEffect, useCallback } from 'react';
import { WalletInfo } from '../types';

export const useWallet = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: '',
    connected: false,
    balance: 0,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is available in window object (MetaMask)
  const checkWalletAvailability = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    console.log('Connecting to wallet...');
    if (!checkWalletAvailability()) {
      setError('MetaMask is not installed. Please install it to use this feature.');
      return;
    }
  
    setIsConnecting(true);
    setError(null);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts:', accounts);
      const account = accounts[0];
  
      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });
      console.log('Balance:', balance); // Додайте це для перевірки
  
      const weiToEther = (wei: string) => {
        return parseFloat(wei) / Math.pow(10, 18); // 1 Ether = 10^18 Wei
      };
      
      setWalletInfo({
        address: account,
        connected: true,
        balance: weiToEther(balance),
      });
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [checkWalletAvailability]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setWalletInfo({
      address: '',
      connected: false,
      balance: 0,
    });
  }, []);

  return {
    walletInfo,
    isConnecting,
    error,
    isWalletAvailable: checkWalletAvailability(),
    connectWallet,
    disconnectWallet
  };
};

export default useWallet;