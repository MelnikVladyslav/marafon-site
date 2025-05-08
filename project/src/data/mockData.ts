import type { Tournament, Bet, WalletInfo } from "../types"

// Mock wallet data
export const mockWallet: WalletInfo = {
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  balance: 1.45,
  connected: false,
  tokens: [
    {
      name: "Esports Betting Token",
      symbol: "EBT",
      balance: 500,
      address: "0x1234567890123456789012345678901234567890",
    },
    {
      name: "Game Credits",
      symbol: "GC",
      balance: 750,
      address: "0x0987654321098765432109876543210987654321",
    },
  ],
}

// Mock tournaments data
export const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "The International 2025",
    game: {
      id: "dota2",
      name: "Dota 2",
      image: "https://images.pexels.com/photos/596750/pexels-photo-596750.jpeg",
    },
    status: "upcoming",
    startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    teams: [
      {
        id: "t1",
        name: "Team Liquid",
        logo: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      },
      {
        id: "t2",
        name: "OG",
        logo: "https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg",
      },
    ],
    odds: [1.75, 2.25],
  },
  {
    id: "2",
    name: "ESL One Stockholm",
    game: {
      id: "csgo",
      name: "CS:GO",
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
    },
    status: "live",
    startTime: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    teams: [
      {
        id: "t3",
        name: "Natus Vincere",
        logo: "https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg",
      },
      {
        id: "t4",
        name: "FaZe Clan",
        logo: "https://images.pexels.com/photos/7915509/pexels-photo-7915509.jpeg",
      },
    ],
    odds: [2.1, 1.65],
  },
  {
    id: "3",
    name: "League of Legends World Championship",
    game: {
      id: "lol",
      name: "League of Legends",
      image: "https://images.pexels.com/photos/7915548/pexels-photo-7915548.jpeg",
    },
    status: "upcoming",
    startTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    teams: [
      {
        id: "t5",
        name: "T1",
        logo: "https://images.pexels.com/photos/7915531/pexels-photo-7915531.jpeg",
      },
      {
        id: "t6",
        name: "DRX",
        logo: "https://images.pexels.com/photos/7915559/pexels-photo-7915559.jpeg",
      },
    ],
    odds: [1.45, 2.75],
  },
  {
    id: "4",
    name: "Fortnite World Cup",
    game: {
      id: "fortnite",
      name: "Fortnite",
      image: "https://images.pexels.com/photos/2506905/pexels-photo-2506905.jpeg",
    },
    status: "upcoming",
    startTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    teams: [
      {
        id: "t7",
        name: "NRG",
        logo: "https://images.pexels.com/photos/7915523/pexels-photo-7915523.jpeg",
      },
      {
        id: "t8",
        name: "Team Liquid",
        logo: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      },
    ],
    odds: [1.9, 1.9],
  },
]

// Mock bets data
export const mockBets: Bet[] = [
  {
    id: "b1",
    tournamentId: "2",
    teamId: "t3",
    amount: 0.05,
    odds: 2.1,
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
    status: "pending",
  },
  {
    id: "b2",
    tournamentId: "1",
    teamId: "t1",
    amount: 0.1,
    odds: 1.75,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: "won",
  },
]
