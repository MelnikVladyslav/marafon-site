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
import { struct, u8 } from "@solana/buffer-layout";
import { u64 as u64Layout } from '@solana/buffer-layout-utils'

// Солана програма ID (встановити твоє значення)
const PROGRAM_ID = "LE4ofTSB2ZgAnA4VrV7YvvAmew6de2e4GiAVDE6rnzW"

function toBufferLE(n: bigint, width = 8): Buffer {
  const hex = n.toString(16).padStart(width * 2, '0')
  return Buffer.from(hex.match(/../g)!.reverse().map((b) => parseInt(b, 16)))
}

export const useSmartContract = (walletInfo: WalletInfo) => {
  const [userBets, setUserBets] = useState<Bet[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [programId] = useState<string>(PROGRAM_ID)
  const [connection, setConnection] = useState<Connection | null>(null)
  const layout = struct([
    u8('instruction'),
    u64Layout('tournamentId'),
    u64Layout('teamId'),
    u64Layout('amount'),
  ])

  const memoizedUserBets = useMemo(() => userBets, [userBets])

  // Ініціалізація з'єднання Solana
  useEffect(() => {
    const conn = new Connection(clusterApiUrl("devnet"), "confirmed")
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
      if (!walletInfo.connected || !connection || !walletInfo.adapter) {
        setError("Wallet not connected. Please connect your wallet first.")
        return null
      }
  
      setIsProcessing(true)
      setError(null)
  
      try {
        const transaction = new Transaction()
        const programId = new PublicKey(PROGRAM_ID)
        const userPublicKey = new PublicKey(walletInfo.address)
  
        if (action === "place") {
          const lamports = BigInt(betDetails.amount * LAMPORTS_PER_SOL)
          const teamId = BigInt(betDetails.teamId) 
          const tournamentId = BigInt(betDetails.tournamentId)
  
          const data = Buffer.alloc(1 + 8 + 8 + 8)
          layout.encode({
            instruction: 1,
            tournamentId: tournamentId,
            teamId: teamId,
            amount: lamports,
          }, data)

          const [betPDA] = await PublicKey.findProgramAddressSync(
            [
              Buffer.from("bet"),
              userPublicKey.toBuffer(),
              toBufferLE(BigInt(betDetails.tournamentId), 8),
              toBufferLE(BigInt(betDetails.teamId), 8),
            ],
            programId
          )

          const instruction = new TransactionInstruction({
            keys: [
              { pubkey: userPublicKey, isSigner: true, isWritable: true },
              { pubkey: betPDA, isSigner: false, isWritable: true },
              { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            programId,
            data,
          })

          transaction.add(instruction)
  
        } else if (action === "withdraw") {
          const data = Buffer.from([
            1, // action: withdraw
            ...Buffer.from(betDetails.betId),
          ])
  
          const instruction = new TransactionInstruction({
            keys: [{ pubkey: userPublicKey, isSigner: true, isWritable: true }],
            programId,
            data,
          })
  
          transaction.add(instruction)
        }
  
        // Підготовка та відправка
        const { blockhash } = await connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = userPublicKey
  
        const signedTx = await window.solana.signTransaction(transaction)
        const signature = await connection.sendRawTransaction(signedTx?.serialize() || '')
        await connection.confirmTransaction(signature)

        setTransactionHash(signature)
  
        if (action === "place") {
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
        } else if (action === "withdraw") {
          setUserBets((prev) =>
            prev.map((bet) => (bet.id === betDetails.betId ? { ...bet, status: "won" } : bet)),
          )
        }
  
        return signature
      } catch (err) {
        console.error("Smart contract error:", err)
        setError("Failed to process your request. Please try again.")
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [walletInfo, connection]
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
