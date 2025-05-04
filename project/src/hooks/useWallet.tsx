import { useState, useEffect, useCallback } from 'react';
import { WalletInfo } from '../types';
import { mockWallet } from '../data/mockData';

export const useWallet = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    ...mockWallet,
    connected: false
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is available in window object (MetaMask)
  const checkWalletAvailability = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // In a real app, this would connect to MetaMask or other wallet
      // For demo, we'll use mock data with a delay to simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWalletInfo({
        ...mockWallet,
        connected: true
      });
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setWalletInfo({
      ...mockWallet,
      connected: false
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