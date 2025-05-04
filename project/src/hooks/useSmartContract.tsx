import { useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { Bet, WalletInfo } from '../types';
import Betting from '../../Betting.json';

export const useSmartContract = (walletInfo: WalletInfo) => {
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const memoizedUserBets = useMemo(() => userBets, [userBets]);

  const handleBet = useCallback(async (action: 'place' | 'withdraw', betDetails: any) => {
    if (!walletInfo.connected) {
      setError('Wallet not connected. Please connect your wallet first.');
      return null;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Підключення до провайдера
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract('0x2222222222222222222222222222222222222222', Betting, signer);

      if (action === 'place') {
        const tx = await contract.placeBet(betDetails.tournamentId, betDetails.teamId, betDetails.amount, betDetails.odds);
        await tx.wait(); // Чекаємо, поки транзакція буде підтверджена
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
        const tx = await contract.withdrawWinnings(betDetails.betId);
        await tx.wait(); // Чекаємо, поки транзакція буде підтверджена
        setUserBets(prev => 
          prev.map(bet => 
            bet.id === betDetails.betId 
              ? { ...bet, status: 'won' } 
              : bet
          )
        );
      }

      setTransactionHash(tx.hash);
      return tx.hash;
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