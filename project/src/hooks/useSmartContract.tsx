import { useState, useCallback } from 'react';
import { Bet, Token, WalletInfo } from '../types';
import { mockBets } from '../data/mockData';

export const useSmartContract = (walletInfo: WalletInfo) => {
  const [userBets, setUserBets] = useState<Bet[]>(mockBets);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Place bet function
  const placeBet = useCallback(async (
    tournamentId: string, 
    teamId: string, 
    amount: number, 
    odds: number
  ) => {
    if (!walletInfo.connected) {
      setError('Wallet not connected. Please connect your wallet first.');
      return null;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real app, this would call a smart contract function
      // For demo, we'll simulate a transaction with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBet: Bet = {
        id: `b${Date.now()}`,
        tournamentId,
        teamId,
        amount,
        odds,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      setUserBets(prev => [newBet, ...prev]);
      
      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      setTransactionHash(txHash);
      
      return txHash;
    } catch (err) {
      setError('Failed to place bet. Please try again.');
      console.error('Smart contract error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [walletInfo]);

  // Withdraw winnings function
  const withdrawWinnings = useCallback(async (betId: string) => {
    if (!walletInfo.connected) {
      setError('Wallet not connected. Please connect your wallet first.');
      return null;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real app, this would call a smart contract function
      // For demo, we'll simulate a transaction with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update bet status
      setUserBets(prev => 
        prev.map(bet => 
          bet.id === betId 
            ? { ...bet, status: 'won' } 
            : bet
        )
      );
      
      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      setTransactionHash(txHash);
      
      return txHash;
    } catch (err) {
      setError('Failed to withdraw winnings. Please try again.');
      console.error('Smart contract error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [walletInfo]);

  return {
    userBets,
    isProcessing,
    transactionHash,
    error,
    placeBet,
    withdrawWinnings
  };
};

export default useSmartContract;