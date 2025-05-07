<<<<<<< Updated upstream
import React from 'react';
=======
"use client"

import type React from "react"
import { useLanguage } from "../context/LanguageContext"
>>>>>>> Stashed changes

interface Leader {
  id: string;
  name: string;
  winnings: number;
  winRate: number;
}

// Mock data for the leaderboard
const mockLeaders: Leader[] = [
  {
    id: '1',
    name: 'Player1',
    winnings: 12.45,
    winRate: 0.78
  },
  {
    id: '2',
    name: 'Player2',
    winnings: 10.32,
    winRate: 0.72
  },
  {
    id: '3',
    name: 'Player3',
    winnings: 8.75,
    winRate: 0.65
  },
  {
    id: '4',
    name: 'Player4',
    winnings: 7.21,
    winRate: 0.61
  },
  {
    id: '5',
    name: 'Player5',
    winnings: 6.89,
    winRate: 0.58
  },
  {
    id: '6',
    name: 'Player6',
    winnings: 5.43,
    winRate: 0.54
  },
  {
    id: '7',
    name: 'Player7',
    winnings: 4.92,
    winRate: 0.51
  },
  {
    id: '8',
    name: 'Player8',
    winnings: 4.15,
    winRate: 0.49
  },
  {
    id: '9',
    name: 'Player9',
    winnings: 3.78,
    winRate: 0.46
  },
  {
    id: '10',
    name: 'Player10',
    winnings: 3.21,
    winRate: 0.43
  }
];

interface LeaderboardProps {
  onBack?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const { t } = useLanguage()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('backToTournaments')}
        </button>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('leaderboardTitle')}</h1>
        <p className="text-gray-400">{t('topPerformers')}</p>
      </div>
      
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 bg-[#0d1117] p-4 border-b border-[#30363d] text-gray-400 font-medium">
          <div className="col-span-1 text-center">#</div>
<<<<<<< Updated upstream
          <div className="col-span-5">Player</div>
          <div className="col-span-3 text-right">Winnings (ETH)</div>
          <div className="col-span-3 text-right">Win Rate</div>
=======
          <div className="col-span-5">{t('player')}</div>
          <div className="col-span-3 text-right">{t('winnings')}</div>
          <div className="col-span-3 text-right">{t('winRate')}</div>
>>>>>>> Stashed changes
        </div>
        
        {/* Table body */}
        <div className="divide-y divide-[#30363d]">
          {mockLeaders.map((leader, index) => (
            <div 
              key={leader.id} 
              className="grid grid-cols-12 p-4 items-center hover:bg-[#1f2937] transition-colors"
            >
              <div className="col-span-1 text-center">
                <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-white text-sm font-semibold ${index < 3 ? 'bg-gradient-to-r from-[#00a8ff] to-[#00f5d4]' : 'bg-[#21262d]'}`}>
                  {index + 1}
                </div>
              </div>
              <div className="col-span-5 flex items-center">
                <span className="text-white font-medium">{leader.name}</span>
              </div>
              <div className="col-span-3 text-right">
                <span className="text-[#00f5d4] font-mono font-medium">{leader.winnings.toFixed(2)}</span>
              </div>
              <div className="col-span-3 text-right">
                <span className="text-white">{(leader.winRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 bg-[#161b22] border border-[#30363d] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">{t('howToJoinLeaderboard')}</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-[#00a8ff] mr-2">•</div>
            <p>{t('connectAndPlaceBets')}</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-[#00a8ff] mr-2">•</div>
            <p>{t('winMoreBets')}</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-[#00a8ff] mr-2">•</div>
            <p>{t('leaderboardUpdatedDaily')}</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-[#00a8ff] mr-2">•</div>
            <p>{t('topPerformersRewards')}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
