import { useState, useCallback, useMemo } from 'react';
import { Bet, Token, WalletInfo } from '../types';
import { mockBets } from '../data/mockData';

export const useSmartContract = (walletInfo: WalletInfo) => {
  const [userBets, setUserBets] = useState<Bet[]>(mockBets);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Memoized user bets
  const memoizedUserBets = useMemo(() => userBets, [userBets]);

  // General function to handle bets
  const handleBet = useCallback(async (action: 'place' | 'withdraw', betDetails: any) => {
    if (!walletInfo.connected) {
      setError('Wallet not connected. Please connect your wallet first.');
      return null;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (action === 'place') {
        const newBet: Bet = {
          id: `b${Date.now()}`,
          tournamentId: betDetails.tournamentId,
          teamId: betDetails.teamId,
          amount: betDetails.amount,
          odds: betDetails.odds,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };
        setUserBets(prev => [newBet, ...prev]);
      } else if (action === 'withdraw') {
        setUserBets(prev => 
          prev.map(bet => 
            bet.id === betDetails.betId 
              ? { ...bet, status: 'won' } 
              : bet
          )
        );
      }

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      setTransactionHash(txHash);
      return txHash;
    } catch (err) {
      setError(`Failed to ${action === 'place' ? 'place bet' : 'withdraw winnings'}. Please try again.`);
      console.error('Smart contract error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [walletInfo]);

  return {
    userBets: memoizedUserBets,
    isProcessing,
    transactionHash,
    error,
    placeBet: (tournamentId: string, teamId: string, amount: number, odds: number) => handleBet('place', { tournamentId, teamId, amount, odds }),
    withdrawWinnings: (betId: string) => handleBet('withdraw', { betId })
  };
};

export default useSmartContract;