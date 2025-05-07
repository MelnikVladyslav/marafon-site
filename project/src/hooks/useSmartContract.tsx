import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js"
import type { Bet, WalletInfo } from "../types"
import { Buffer } from "buffer"

// Солана програма ID (встановити твоє значення)
const PROGRAM_ID = "LE4ofTSB2ZgAnA4VrV7YvvAmew6de2e4GiAVDE6rnzW"

export const useSmartContract = (walletInfo: WalletInfo) => {
  const [userBets, setUserBets] = useState<Bet[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [programId] = useState<string>(PROGRAM_ID)
  const [connection, setConnection] = useState<Connection | null>(null)

  const memoizedUserBets = useMemo(() => userBets, [userBets])

  // Ініціалізація з'єднання Solana
  useEffect(() => {
    const conn = new Connection(clusterApiUrl("devnet"))
    setConnection(conn)
  }, [])

  // Завантаження ставок користувача
  const loadUserBets = useCallback(async () => {
    if (!walletInfo.connected || !walletInfo.address || !connection) return

    setIsLoading(true)
    setError(null)

    try {
      // Тут ти маєш реалізувати логіку отримання ставок користувача з твого контракту
      console.log("Loading bets for address:", walletInfo.address)

      // Приклад мокових даних
      const mockBetsFromChain: Bet[] = [
        {
          id: "sol-bet-1",
          tournamentId: "1",
          teamId: "2",
          amount: 0.5,
          odds: 2.5,
          timestamp: new Date().toISOString(),
          status: "pending",
        },
      ]

      setUserBets(mockBetsFromChain)
    } catch (err) {
      console.error("Failed to load user bets:", err)
      setError("Failed to load your bets. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [walletInfo.connected, walletInfo.address, connection])

  // Завантаження ставок при підключенні гаманця
  useEffect(() => {
    if (walletInfo.connected) {
      loadUserBets()
    }
  }, [walletInfo.connected, loadUserBets])

  // Обробка ставки або виведення
  const handleBet = useCallback(
    async (action: "place" | "withdraw", betDetails: any) => {
      if (!walletInfo.connected || !connection) {
        setError("Wallet not connected. Please connect your wallet first.")
        return null
      }

      setIsProcessing(true)
      setError(null)

      try {
        const transaction = new Transaction()

        const programId = new PublicKey(PROGRAM_ID)

        if (action === "place") {
          // Перетворення суми на лямпорти
          const lamports = betDetails.amount * LAMPORTS_PER_SOL

          // Формуємо інструкцію для смартконтракту
          const data = Buffer.from([
            0, // action: place bet
            Number(betDetails.tournamentId),
            Number(betDetails.teamId),
            ...new Uint8Array(new Float64Array([lamports]).buffer),
            ...new Uint8Array(new Float64Array([betDetails.odds * 100]).buffer),
          ])

          const instruction = new TransactionInstruction({
            keys: [
              { pubkey: new PublicKey(walletInfo.address), isSigner: true, isWritable: true },
            ],
            programId,
            data,
          })

          const { blockhash } = await connection.getLatestBlockhash()
          transaction.recentBlockhash = blockhash
          transaction.feePayer = new PublicKey(walletInfo.address)

          transaction.add(instruction)

          // Надсилаємо транзакцію
          const { signature } = await window.solana.signAndSendTransaction(transaction)
          await connection.confirmTransaction(signature)

          setTransactionHash(signature)

          // Додаємо ставку до списку ставок
          const newBet: Bet = {
            id: `pending-${Date.now()}`,
            tournamentId: betDetails.tournamentId,
            teamId: betDetails.teamId,
            amount: betDetails.amount,
            odds: betDetails.odds,
            timestamp: new Date().toISOString(),
            status: "pending",
          }

          setUserBets((prev) => [newBet, ...prev])
          return signature
        } else if (action === "withdraw") {
          // Інструкція для виведення виграшу
          const data = Buffer.from([
            1, // action: withdraw
            ...Buffer.from(betDetails.betId),
          ])

          const instruction = new TransactionInstruction({
            keys: [
              { pubkey: new PublicKey(walletInfo.address), isSigner: true, isWritable: true },
            ],
            programId,
            data,
          })

          transaction.add(instruction)

          // Надсилаємо транзакцію
          const { signature } = await window.solana.signAndSendTransaction(transaction)
          await connection.confirmTransaction(signature)

          setTransactionHash(signature)

          setUserBets((prev) =>
            prev.map((bet) => (bet.id === betDetails.betId ? { ...bet, status: "won" } : bet)),
          )

          return signature
        }
      } catch (err) {
        console.error("Smart contract error:", err)
        setError("Failed to process your request. Please try again.")
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [walletInfo, connection],
  )

  // Функція для оновлення даних ставок
  const refreshBets = useCallback(() => {
    loadUserBets()
  }, [loadUserBets])

  return {
    userBets: memoizedUserBets,
    isProcessing,
    isLoading,
    transactionHash,
    error,
    contractAddress: programId,
    placeBet: (tournamentId: string, teamId: string, amount: number, odds: number) =>
      handleBet("place", { tournamentId, teamId, amount, odds }),
    withdrawWinnings: (betId: string) => handleBet("withdraw", { betId }),
    refreshBets,
  }
}

export default useSmartContract
