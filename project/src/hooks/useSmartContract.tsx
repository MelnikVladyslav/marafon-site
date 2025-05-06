import { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import type { Bet, WalletInfo } from '../types';
import Betting from '../../Betting.json';

// Адреса контракту в мережі Sepolia
const CONTRACT_ADDRESS = "0x2222222222222222222222222222222222222222";

export const useSmartContract = (walletInfo: WalletInfo) => {
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>(CONTRACT_ADDRESS);

  const memoizedUserBets = useMemo(() => userBets, [userBets]);

  // Отримання контракту
  const getContract = useCallback(async () => {
    if (!walletInfo.connected || !window.ethereum) {
      throw new Error("Wallet not connected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum); // Використовуйте BrowserProvider
    const signer = await provider.getSigner(); // Отримайте підписувача
    return new ethers.Contract(contractAddress, Betting.abi, signer);
  }, [walletInfo.connected, contractAddress]);

  // Завантаження ставок користувача з блокчейну
  const loadUserBets = useCallback(async () => {
    if (!walletInfo.connected || !walletInfo.address) return;

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();

      // Отримуємо всі ставки користувача з блокчейну
      const userBetsFromChain = await contract.getUserBets(walletInfo.address);

      // Перетворюємо дані з блокчейну у формат, який використовується в додатку
      const formattedBets: Bet[] = userBetsFromChain.map((bet: any) => ({
        id: bet.id.toString(),
        tournamentId: bet.tournamentId.toString(),
        teamId: bet.teamId.toString(),
        amount: Number.parseFloat(ethers.utils.formatEther(bet.amount)),
        odds: Number.parseFloat(ethers.utils.formatUnits(bet.odds, 2)),
        timestamp: new Date(bet.timestamp.toNumber() * 1000).toISOString(),
        status: bet.status === 0 ? "pending" : bet.status === 1 ? "won" : "lost",
      }));

      setUserBets(formattedBets);
    } catch (err) {
      console.error("Failed to load user bets:", err);
      setError("Failed to load your bets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [walletInfo.connected, walletInfo.address, getContract]);

  // Завантажуємо ставки при підключенні гаманця
  useEffect(() => {
    if (walletInfo.connected) {
      loadUserBets();
    }
  }, [walletInfo.connected, loadUserBets]);

  // Підписка на події контракту
  useEffect(() => {
    const setupEventListeners = async () => {
      if (!walletInfo.connected) return;

      try {
        const contract = await getContract();

        // Підписуємось на подію нової ставки
        contract.on("BetPlaced", (user, betId, tournamentId, teamId, amount, odds) => {
          if (user.toLowerCase() === walletInfo.address.toLowerCase()) {
            const newBet: Bet = {
              id: betId.toString(),
              tournamentId: tournamentId.toString(),
              teamId: teamId.toString(),
              amount: Number.parseFloat(ethers.utils.formatEther(amount)),
              odds: Number.parseFloat(ethers.utils.formatUnits(odds, 2)),
              timestamp: new Date().toISOString(),
              status: "pending",
            };

            setUserBets((prev) => [newBet, ...prev]);
          }
        });

        // Підписуємось на подію оновлення статусу ставки
        contract.on("BetStatusUpdated", (betId, status) => {
          setUserBets((prev) =>
            prev.map((bet) => (bet.id === betId.toString() ? { ...bet, status: status === 1 ? "won" : "lost" } : bet)),
          );
        });

        // Підписуємось на подію виведення виграшу
        contract.on("WinningsWithdrawn", (user, betId, amount) => {
          if (user.toLowerCase() === walletInfo.address.toLowerCase()) {
            // Оновлюємо статус ставки після виведення виграшу
            setUserBets((prev) => prev.map((bet) => (bet.id === betId.toString() ? { ...bet, status: "won" } : bet)));
          }
        });

        return () => {
          // Відписуємось від подій при розмонтуванні компонента
          contract.removeAllListeners();
        };
      } catch (err) {
        console.error("Failed to setup event listeners:", err);
      }
    };

    setupEventListeners();
  }, [walletInfo.connected, walletInfo.address, getContract]);

  // Обробка ставок та виведення виграшів
  const handleBet = useCallback(
    async (action: "place" | "withdraw", betDetails: any) => {
      if (!walletInfo.connected) {
        setError("Гаманець не підключено. Будь ласка, підключіть гаманець спочатку.");
        return null;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const contract = await getContract();
        let tx;

        if (action === "place") {
          // Конвертуємо суму ставки в wei
          const amountInWei = parseFloat(betDetails.amount) * Number(10 ** 18);

          // Конвертуємо коефіцієнт у формат з двома десятковими знаками
          const oddsFormatted = Math.round(betDetails.odds * 100);

          // Викликаємо метод контракту для розміщення ставки
          tx = await contract.placeBet(betDetails.tournamentId, betDetails.teamId, amountInWei, oddsFormatted, {
            // Додаємо газліміт для запобігання помилок
            gasLimit: 300000,
          });

          // Чекаємо підтвердження транзакції
          await tx.wait();

          // Додаємо нову ставку до локального стану
          // Реальні дані прийдуть через подію BetPlaced
          const newBet: Bet = {
            id: `pending-${Date.now()}`,
            tournamentId: betDetails.tournamentId,
            teamId: betDetails.teamId,
            amount: betDetails.amount,
            odds: betDetails.odds,
            timestamp: new Date().toISOString(),
            status: "pending",
          };

          setUserBets((prev) => [newBet, ...prev]);
        } else if (action === "withdraw") {
          // Викликаємо метод контракту для виведення виграшу
          tx = await contract.withdrawWinnings(betDetails.betId, {
            gasLimit: 300000,
          });

          // Чекаємо підтвердження транзакції
          await tx.wait();

          // Оновлюємо статус ставки локально
          // Реальні дані прийдуть через подію WinningsWithdrawn
          setUserBets((prev) => prev.map((bet) => (bet.id === betDetails.betId ? { ...bet, status: "won" } : bet)));
        }

        setTransactionHash(tx.hash);
        return tx.hash;
      } catch (err: any) {
        console.error("Smart contract error:", err);

        // Більш детальне повідомлення про помилку
        const errorMessage =
          err.reason ||
          err.message ||
          `Не вдалося ${action === "place" ? "розмістити ставку" : "вивести виграш"}. Спробуйте ще раз.`;
        setError(errorMessage);

        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [walletInfo, getContract],
  );

  // Функція для оновлення даних
  const refreshBets = useCallback(() => {
    loadUserBets();
  }, [loadUserBets]);

  return {
    userBets: memoizedUserBets,
    isProcessing,
    isLoading,
    transactionHash,
    error,
    contractAddress,
    placeBet: (tournamentId: string, teamId: string, amount: number, odds: number) =>
      handleBet("place", { tournamentId, teamId, amount, odds }),
    withdrawWinnings: (betId: string) => handleBet("withdraw", { betId }),
    refreshBets,
  };
};

export default useSmartContract;