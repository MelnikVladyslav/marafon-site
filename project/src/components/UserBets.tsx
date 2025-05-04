import React from 'react';
import { Bet, Tournament } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface UserBetsProps {
  bets: Bet[];
  tournaments: Tournament[];
  onWithdraw: (betId: string) => Promise<string | null>;
  isProcessing: boolean;
}

const UserBets: React.FC<UserBetsProps> = React.memo(({ bets, tournaments, onWithdraw, isProcessing }) => {
  const [expandedBet, setExpandedBet] = React.useState<string | null>(null);

  // Toggle expanded bet
  const toggleExpand = (betId: string) => {
    setExpandedBet(expandedBet === betId ? null : betId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get tournament and team details for a bet
  const getBetDetails = (bet: Bet) => {
    const tournament = tournaments.find(t => t.id === bet.tournamentId);
    const team = tournament?.teams.find(t => t.id === bet.teamId);
    
    return {
      tournamentName: tournament?.name || 'Unknown Tournament',
      teamName: team?.name || 'Unknown Team',
      teamLogo: team?.logo || '',
      gameName: tournament?.game.name || 'Unknown Game'
    };
  };

  // Get status badge styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'won':
        return 'bg-green-500 text-black';
      case 'lost':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Calculate potential winnings
  const calculateWinnings = (bet: Bet) => {
    return bet.amount * bet.odds;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">My Bets</h2>
      
      {bets.length > 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          {bets.map((bet) => {
            const { tournamentName, teamName, teamLogo, gameName } = getBetDetails(bet);
            const potentialWinnings = calculateWinnings(bet);
            
            return (
              <div 
                key={bet.id} 
                className="border-b border-[#30363d] last:border-b-0"
              >
                <div 
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#21262d] transition-colors"
                  onClick={() => toggleExpand(bet.id)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-[#30363d] mr-3">
                      <img 
                        src={teamLogo} 
                        alt={teamName} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{teamName}</p>
                      <p className="text-gray-400 text-sm">{tournamentName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(bet.status)}`}>
                        {bet.status.toUpperCase()}
                      </span>
                    </div>
                    {expandedBet === bet.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {expandedBet === bet.id && (
                  <div className="px-4 py-4 bg-[#0d1117] border-t border-[#30363d]">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Amount</p>
                        <p className="text-white font-mono font-semibold">{bet.amount.toFixed(4)} ETH</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Odds</p>
                        <p className="text-white font-mono font-semibold">{bet.odds.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Potential Winnings</p>
                        <p className="text-[#00f5d4] font-mono font-semibold">{potentialWinnings.toFixed(4)} ETH</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Date Placed</p>
                        <p className="text-white text-sm">{formatDate(bet.timestamp)}</p>
                      </div>
                    </div>
                    
                    {bet.status === 'won' && (
                      <button
                        onClick={() => onWithdraw(bet.id)}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-[#00a8ff] to-[#00f5d4] hover:from-[#00a8ff] hover:to-[#00d8c6] text-black font-semibold py-2 rounded-lg transition-all transform hover:scale-[1.02]"
                      >
                        {isProcessing ? 'Processing...' : 'Withdraw Winnings'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 text-center">
          <p className="text-gray-400">You haven't placed any bets yet</p>
        </div>
      )}
    </div>
  );
});

export default UserBets;