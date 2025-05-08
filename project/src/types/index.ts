// Type definitions for the application
import type { WalletAdapter } from '@solana/wallet-adapter-base';

export interface Tournament {
  id: string
  name: string
  game: Game
  status: "upcoming" | "live" | "completed"
  startTime: string
  teams: [Team, Team]
  odds: [number, number]
}

export interface Team {
  id: string
  name: string
  logo: string
}

export interface Game {
  id: string
  name: string
  image: string
}

export interface Bet {
  id: string
  tournamentId: string
  teamId: string
  amount: number
  odds: number
  timestamp: string
  status: "pending" | "won" | "lost"
}

export interface Token {
  name: string
  symbol: string
  balance: number
  address: string
}

export interface WalletInfo {
  address: string
  balance: number
  connected: boolean
  tokens?: Token[]
  adapter: any
}

// Add Solana specific types
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
      signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>
      isConnected: boolean
    }
  }
}
