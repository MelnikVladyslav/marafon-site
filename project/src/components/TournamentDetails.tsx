import React, { useCallback } from 'react';
import { Tournament } from '../types';
import { Clock, Award, ArrowLeft, Users, Calendar, Trophy } from 'lucide-react';

interface TournamentDetailsProps {
  tournament: Tournament;
  onBack: () => void;
  onPlaceBet: (tournamentId: string, teamId: string, teamName: string, odds: number) => void;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ tournament, onBack, onPlaceBet }) => {
  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Status badge styles based on status
  const getStatusStyles = useCallback(() => {
    switch (tournament.status) {
      case 'live':
        return 'bg-red-500 text-white animate-pulse';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }, [tournament.status]);

  const handlePlaceBet = useCallback((teamId: string, teamName: string, odds: number) => {
    onPlaceBet(tournament.id, teamId, teamName, odds);
  }, [onPlaceBet, tournament.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Tournaments
      </button>
      
      {/* Tournament header */}
      <div className="relative h-64 w-full rounded-lg overflow-hidden mb-8">
        <img 
          src={tournament.game.image} 
          alt={tournament.game.name} 
          className="w-full h-full object-cover filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex items-center mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles()} mr-3`}>
              {tournament.status.toUpperCase()}
            </span>
            <span className="text-gray-300 text-sm">{tournament.game.name}</span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-bold">{tournament.name}</h1>
        </div>
      </div>
      
      {/* Tournament details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Teams and betting */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#30363d]">
              <h2 className="text-xl font-bold text-white">Teams</h2>
            </div>
            
            <div className="p-6">
              {/* Team 1 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#0d1117] rounded-lg mb-4">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-[#30363d] mr-4">
                    <img 
                      src={tournament.teams[0].logo} 
                      alt={tournament.teams[0].name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">{tournament.teams[0].name}</h3>
                    <p className="text-gray-400">Team ID: {tournament.teams[0].id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-white text-2xl font-bold mb-2">{tournament.odds[0].toFixed(2)}</div>
                  <button 
                    onClick={() => handlePlaceBet(
                      tournament.teams[0].id,
                      tournament.teams[0].name,
                      tournament.odds[0]
                    )}
                    className="bg-gradient-to-r from-[#00a8ff] to-[#00f5d4] hover:from-[#00a8ff] hover:to-[#00d8c6] text-black font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                  >
                    Place Bet
                  </button>
                </div>
              </div>
              
              {/* VS divider */}
              <div className="flex items-center justify-center my-6">
                <div className="h-px bg-[#30363d] flex-grow"></div>
                <div className="px-4 text-gray-400 font-bold">VS</div>
                <div className="h-px bg-[#30363d] flex-grow"></div>
              </div>
              
              {/* Team 2 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#0d1117] rounded-lg">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-[#30363d] mr-4">
                    <img 
                      src={tournament.teams[1].logo} 
                      alt={tournament.teams[1].name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">{tournament.teams[1].name}</h3>
                    <p className="text-gray-400">Team ID: {tournament.teams[1].id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-white text-2xl font-bold mb-2">{tournament.odds[1].toFixed(2)}</div>
                  <button 
                    onClick={() => handlePlaceBet(
                      tournament.teams[1].id,
                      tournament.teams[1].name,
                      tournament.odds[1]
                    )}
                    className="bg-gradient-to-r from-[#00a8ff] to-[#00f5d4] hover:from-[#00a8ff] hover:to-[#00d8c6] text-black font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                  >
                    Place Bet
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tournament description */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#30363d]">
              <h2 className="text-xl font-bold text-white">Tournament Details</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                {tournament.name} is a premier esports event featuring top teams competing for glory and prizes. 
                This tournament showcases the best talent in {tournament.game.name} and promises exciting matches 
                and unforgettable moments for fans and bettors alike.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-[#00a8ff] mr-3" />
                  <div>
                    <div className="text-gray-400 text-sm">Start Time</div>
                    <div className="text-white">{formatDate(tournament.startTime)}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-[#00a8ff] mr-3" />
                  <div>
                    <div className="text-gray-400 text-sm">Prize Pool</div>
                    <div className="text-white">$1,000,000</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-[#00a8ff] mr-3" />
                  <div>
                    <div className="text-gray-400 text-sm">Teams</div>
                    <div className="text-white">2 Teams</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-[#00a8ff] mr-3" />
                  <div>
                    <div className="text-gray-400 text-sm">Format</div>
                    <div className="text-white">Best of 5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Betting Stats */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#30363d]">
              <h2 className="text-xl font-bold text-white">Betting Stats</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Bets Placed</span>
                  <span className="text-white font-medium">1,245</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Volume</span>
                  <span className="text-white font-medium">87.5 SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Bet Size</span>
                  <span className="text-white font-medium">0.07 SOL</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#30363d]">
                <h3 className="text-white font-medium mb-3">Betting Distribution</h3>
                
                {/* Team 1 distribution */}
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 text-sm">{tournament.teams[0].name}</span>
                    <span className="text-gray-400 text-sm">65%</span>
                  </div>
                  <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00a8ff] to-[#00f5d4]" 
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>
                
                {/* Team 2 distribution */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400 text-sm">{tournament.teams[1].name}</span>
                    <span className="text-gray-400 text-sm">35%</span>
                  </div>
                  <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#9d4edd]" 
                      style={{ width: '35%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Bets */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#30363d]">
              <h2 className="text-xl font-bold text-white">Recent Bets</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-b border-[#30363d] last:border-0">
                    <div className="flex items-center">
                      <div>
                        <div className="text-white text-sm">Player{index}</div>
                        <div className="text-gray-400 text-xs">{index % 2 === 0 ? tournament.teams[0].name : tournament.teams[1].name}</div>
                      </div>
                    </div>
                    <div className="text-[#00f5d4] font-mono text-sm">{(0.05 + index * 0.02).toFixed(2)} SOL</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
