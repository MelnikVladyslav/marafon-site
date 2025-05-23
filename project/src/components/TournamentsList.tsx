"use client"

import type React from "react"
import { useState, memo, useEffect } from "react"
import TournamentCard from "./TournamentCard"
import PlaceBetModal from "./PlaceBetModal"
import { Search } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { Tournament } from "../types"
import { getAllTournaments } from "../api/pandascoreAPI"

interface TournamentsListProps {
  onPlaceBet: (tournamentId: string, teamId: string, amount: number, odds: number) => Promise<string | null>
  isWalletConnected: boolean
  onTournamentClick?: (tournamentId: string, tournaments: Tournament[]) => void
}

const TournamentsList: React.FC<TournamentsListProps> = memo(
  ({ onPlaceBet, isWalletConnected, onTournamentClick }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedGame, setSelectedGame] = useState<string | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        try {
          const data = await getAllTournaments()
          setTournaments(data)
        } catch (err) {
          console.error("Failed to load tournaments", err)
        } finally {
          setLoading(false)
        }
      }
    
      fetchData()
    }, [])

    // Modal state
    const [isBetModalOpen, setIsBetModalOpen] = useState(false)
    const [selectedBet, setSelectedBet] = useState<{
      tournamentId: string
      teamId: string
      teamName: string
      odds: number
    } | null>(null)

    // Filter tournaments
    const filteredTournaments = tournaments.filter((tournament) => {
      const matchesSearch =
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.teams.some((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesGame = selectedGame ? tournament.game.id === selectedGame : true
      const matchesStatus = selectedStatus ? tournament.status === selectedStatus : true

      return matchesSearch && matchesGame && matchesStatus
    })

    // Get unique game options for filter
    const gameOptions = Array.from(new Set(tournaments.map((t) => t.game.id))).map((gameId) => {
      const game = tournaments.find((t) => t.game.id === gameId)?.game
      return { id: gameId, name: game?.name || "" }
    })

    // Handle opening bet modal
    const handleOpenBetModal = (tournamentId: string, teamId: string, teamName: string, odds: number) => {
      setSelectedBet({ tournamentId, teamId, teamName, odds })
      setIsBetModalOpen(true)
    }

    // Handle bet placement
    const handlePlaceBet = async (amount: number): Promise<string | null> => {
      if (selectedBet) {
        const result = await onPlaceBet(selectedBet.tournamentId, selectedBet.teamId, amount, selectedBet.odds)

        if (result) {
          setIsBetModalOpen(false)
          setSelectedBet(null)
        }
        return result
      }
      return null
    }

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">{t('tournaments')}</h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('search_tournaments_teams')}
                className="bg-[#0d1117] border border-[#30363d] text-white rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00a8ff] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                className="bg-[#0d1117] border border-[#30363d] text-white rounded-lg px-4 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00a8ff]"
                value={selectedGame || ""}
                onChange={(e) => setSelectedGame(e.target.value || null)}
              >
                <option value="">{t('all_games')}</option>
                {gameOptions.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>

              <select
                className="bg-[#0d1117] border border-[#30363d] text-white rounded-lg px-4 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00a8ff]"
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
              >
                <option value="">{t('all_status')}</option>
                <option value="live">{t('tournament_status_live')}</option>
                <option value="upcoming">{t('tournament_status_upcoming')}</option>
                <option value="completed">{t('tournament_status_completed')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tournaments grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                onClick={() => onTournamentClick && onTournamentClick(tournament.id, tournaments)}
                className={`cursor-pointer ${onTournamentClick ? "hover:scale-[1.03] transition-transform" : ""}`}
              >
                <TournamentCard tournament={tournament} onPlaceBet={handleOpenBetModal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 text-center">
            <p className="text-gray-400">{t('no_tournaments_found')}</p>
          </div>
        )}

        {/* Place bet modal */}
        {selectedBet && (
          <PlaceBetModal
            isOpen={isBetModalOpen}
            onClose={() => setIsBetModalOpen(false)}
            teamName={selectedBet.teamName}
            odds={selectedBet.odds}
            onPlaceBet={handlePlaceBet}
            isWalletConnected={isWalletConnected}
          />
        )}
      </div>
    )
  },
)

export default TournamentsList
