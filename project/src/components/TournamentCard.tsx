"use client"

import React, { useCallback } from "react"
import type { Tournament } from "../types"
import { Clock } from "lucide-react"

interface TournamentCardProps {
  tournament: Tournament
  onPlaceBet: (tournamentId: string, teamId: string, teamName: string, odds: number) => void
}

const TournamentCard: React.FC<TournamentCardProps> = React.memo(({ tournament, onPlaceBet }) => {
  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  // Status badge styles based on status
  const getStatusStyles = useCallback(() => {
    switch (tournament.status) {
      case "live":
        return "bg-red-500 text-white animate-pulse"
      case "upcoming":
        return "bg-blue-500 text-white"
      case "completed":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }, [tournament.status])

  const handlePlaceBet = useCallback(
    (teamId: string, teamName: string, odds: number) => {
      onPlaceBet(tournament.id, teamId, teamName, odds)
    },
    [onPlaceBet, tournament.id],
  )

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-lg">
      {/* Game banner */}
      <div className="relative h-32 w-full overflow-hidden">
        <img
          src={tournament.game.image || "https://images.pexels.com/photos/596750/pexels-photo-596750.jpeg"}
          alt={tournament.game.name}
          className="w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent"></div>
        <div className="absolute bottom-2 left-3 flex items-center">
          <span className="text-white font-semibold text-lg">{tournament.game.name}</span>
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusStyles()}`}>
            {tournament.status?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tournament info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{tournament.name}</h3>

        <div className="flex items-center text-gray-400 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{formatDate(tournament.startTime)}</span>
        </div>

        {/* Teams */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-[#30363d] mr-2">
                <img
                  src={tournament.teams[0]?.logo}
                  alt={tournament.teams[0]?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-white font-medium">{tournament.teams[0]?.name}</span>
            </div>
            <button
              onClick={() => handlePlaceBet(tournament.teams[0]?.id, tournament.teams[0]?.name, tournament.odds[0])}
              className="bg-[#30363d] hover:bg-[#3c444d] text-white px-3 py-1 rounded-md transition-colors"
            >
              {tournament.odds[0].toFixed(2)}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-[#30363d] mr-2">
                <img
                  src={tournament.teams[1]?.logo}
                  alt={tournament.teams[1]?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-white font-medium">{tournament.teams[1]?.name}</span>
            </div>
            <button
              onClick={() => handlePlaceBet(tournament.teams[1]?.id, tournament.teams[1]?.name, tournament.odds[1])}
              className="bg-[#30363d] hover:bg-[#3c444d] text-white px-3 py-1 rounded-md transition-colors"
            >
              {tournament.odds[1].toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default TournamentCard
