"use client"

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

// Solana program ID (replace with your actual deployed program ID)
const PROGRAM_ID = "BETTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

export const useSmartContract = (walletInfo: WalletInfo) => {
  const [userBets, setUserBets] = useState<Bet[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [programId] = useState<string>(PROGRAM_ID)
  const [connection, setConnection] = useState<Connection | null>(null)

  const memoizedUserBets = useMemo(() => userBets, [userBets])

  // Initialize Solana connection
  useEffect(() => {
    const conn = new Connection(clusterApiUrl("devnet"))
    setConnection(conn)
  }, [])

  // Load user bets from the program
  const loadUserBets = useCallback(async () => {
    if (!walletInfo.connected || !walletInfo.address || !connection) return

    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, you would fetch account data from your Solana program
      // This is a simplified mock implementation
      console.log("Loading bets for address:", walletInfo.address)

      // Mock data - in a real implementation, you would deserialize data from your program
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
        {
          id: "sol-bet-2",
          tournamentId: "3",
          teamId: "5",
          amount: 0.2,
          odds: 1.8,
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: "won",
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

  // Load bets when wallet connects
  useEffect(() => {
    if (walletInfo.connected) {
      loadUserBets()
    }
  }, [walletInfo.connected, loadUserBets])

  // Handle bet placement and withdrawal
  const handleBet = useCallback(
    async (action: "place" | "withdraw", betDetails: any) => {
      if (!walletInfo.connected || !connection) {
        setError("Wallet not connected. Please connect your wallet first.")
        return null
      }

      setIsProcessing(true)
      setError(null)

      try {
        // Create a new transaction
        const transaction = new Transaction()

        if (action === "place") {
          // Convert amount to lamports
          const lamports = betDetails.amount * LAMPORTS_PER_SOL

          // In a real implementation, you would create a proper instruction to your program
          // This is a simplified example
          const programId = new PublicKey(PROGRAM_ID)

          // Create instruction data buffer
          // Format: [action, tournamentId, teamId, amount, odds]
          const data = Buffer.from([
            0, // action: place bet
            Number(betDetails.tournamentId),
            Number(betDetails.teamId),
            ...new Uint8Array(new Float64Array([lamports]).buffer),
            ...new Uint8Array(new Float64Array([betDetails.odds * 100]).buffer),
          ])

          // Create the instruction
          const instruction = new TransactionInstruction({
            keys: [{ pubkey: new PublicKey(walletInfo.address), isSigner: true, isWritable: true }],
            programId,
            data,
          })

          transaction.add(instruction)

          // For demo purposes, we'll just add a simple transfer
          // In a real implementation, you would call your program
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: new PublicKey(walletInfo.address),
              toPubkey: new PublicKey(programId),
              lamports: lamports,
            }),
          )
        } else if (action === "withdraw") {
          // Similar to place bet, but with different action code
          // In a real implementation, you would create a proper instruction to your program
          const programId = new PublicKey(PROGRAM_ID)

          // Create instruction data buffer
          // Format: [action, betId]
          const data = Buffer.from([
            1, // action: withdraw
            ...Buffer.from(betDetails.betId),
          ])

          // Create the instruction
          const instruction = new TransactionInstruction({
            keys: [{ pubkey: new PublicKey(walletInfo.address), isSigner: true, isWritable: true }],
            programId,
            data,
          })

          transaction.add(instruction)
        }

        // Send the transaction
        if (window.solana && window.solana.isConnected) {
          // Sign and send the transaction
          const { signature } = await window.solana.signAndSendTransaction(transaction)

          // Wait for confirmation
          await connection.confirmTransaction(signature)

          setTransactionHash(signature)

          // Update local state
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
            setUserBets((prev) => prev.map((bet) => (bet.id === betDetails.betId ? { ...bet, status: "won" } : bet)))
          }

          return signature
        }

        return null
      } catch (err: any) {
        console.error("Smart contract error:", err)

        const errorMessage =
          err.message || `Failed to ${action === "place" ? "place bet" : "withdraw winnings"}. Please try again.`
        setError(errorMessage)

        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [walletInfo, connection],
  )

  // Function to refresh data
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
