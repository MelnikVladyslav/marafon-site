"use client"

import { useState, useCallback, useEffect } from "react"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import type { WalletInfo } from "../types"

// Define Solana network - using devnet for development
const SOLANA_NETWORK = clusterApiUrl("devnet")

export const useWallet = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: "",
    connected: false,
    balance: 0,
    tokens: [],
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalMessage, setModalMessage] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [connection, setConnection] = useState<Connection | null>(null)

  // Initialize Solana connection
  useEffect(() => {
    const conn = new Connection(SOLANA_NETWORK)
    setConnection(conn)
  }, [])

  // Check if Phantom wallet is available
  const checkWalletAvailability = useCallback(() => {
    const isPhantomInstalled = typeof window !== "undefined" && window.solana && window.solana.isPhantom
    return isPhantomInstalled
  }, [])

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    console.log("Connecting to Solana wallet...")
    if (!checkWalletAvailability()) {
      setError("Phantom wallet is not installed. Please install it to use this feature.")
      setModalMessage("Phantom wallet is not installed. Please install it to use this feature.")
      setIsModalOpen(true)
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request connection to Phantom wallet
      const resp = await window.solana.connect()
      console.log("Connected to wallet:", resp.publicKey.toString())

      // Get wallet public key
      const publicKey = new PublicKey(resp.publicKey.toString())

      // Get SOL balance
      if (connection) {
        const balance = await connection.getBalance(publicKey)
        console.log("Balance (lamports):", balance)

        // Convert lamports to SOL (1 SOL = 10^9 lamports)
        const solBalance = balance / 1_000_000_000

        setWalletInfo({
          address: publicKey.toString(),
          connected: true,
          balance: solBalance,
          tokens: [
            {
              name: "Solana",
              symbol: "SOL",
              balance: solBalance,
              address: "native",
            },
          ],
        })
        setModalMessage("Wallet connected successfully!")
        setIsModalOpen(true)
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err)
      setError("Failed to connect wallet. Please try again.")
      setModalMessage("Failed to connect wallet. Please try again.")
      setIsModalOpen(true)
    } finally {
      setIsConnecting(false)
    }
  }, [checkWalletAvailability, connection])

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Disconnect wallet function
  const disconnectWallet = useCallback(async () => {
    try {
      if (window.solana && window.solana.isConnected) {
        await window.solana.disconnect()
      }

      setWalletInfo({
        address: "",
        connected: false,
        balance: 0,
        tokens: [],
      })
    } catch (err) {
      console.error("Error disconnecting wallet:", err)
    }
  }, [])

  return {
    walletInfo,
    isConnecting,
    error,
    isWalletAvailable: checkWalletAvailability(),
    connectWallet,
    disconnectWallet,
    modalMessage,
    isModalOpen,
    closeModal,
  }
}

export default useWallet
