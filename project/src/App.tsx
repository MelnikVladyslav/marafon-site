import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TournamentsList from './components/TournamentsList';
import UserBets from './components/UserBets';
import TokenDisplay from './components/TokenDisplay';
import TransactionNotification from './components/TransactionNotification';
import useWallet from './hooks/useWallet';
import useSmartContract from './hooks/useSmartContract';
import { mockTournaments } from './data/mockData';

function App() {
  // Get wallet and smart contract hooks
  const { 
    walletInfo, 
    isConnecting, 
    error: walletError, 
    connectWallet, 
    disconnectWallet,
    modalMessage,
    isModalOpen,
    closeModal 
  } = useWallet();
  
  const { 
    userBets, 
    isProcessing, 
    transactionHash, 
    error: contractError,
    placeBet, 
    withdrawWinnings 
  } = useSmartContract(walletInfo);
  
  // Transaction notification state
  const [showTxNotification, setShowTxNotification] = useState(false);
  
  // Handle placing a bet
  const handlePlaceBet = async (tournamentId: string, teamId: string, amount: number, odds: number) => {
    const result = await placeBet(tournamentId, teamId, amount, odds);
    if (result) {
      setShowTxNotification(true);
    }
    return result;
  };
  
  // Handle withdrawing winnings
  const handleWithdraw = async (betId: string) => {
    const result = await withdrawWinnings(betId);
    if (result) {
      setShowTxNotification(true);
    }
    return result;
  };
  
  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      <Header 
        walletInfo={walletInfo}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        isConnecting={isConnecting}
        modalMessage={modalMessage}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
      
      {/* Hero section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00a8ff]/20 to-[#9d4edd]/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00a8ff] to-[#00f5d4]">
              Crypto Esports Betting
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect your wallet, place bets on your favorite teams, and win crypto
            </p>
            {!walletInfo.connected && (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-[#00a8ff] to-[#00f5d4] hover:from-[#00a8ff] hover:to-[#00d8c6] text-black font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet to Start'}
              </button>
            )}
          </div>
        </div>
      </section>
      
      {/* Main content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tournaments section */}
            <section id="tournaments" className="mb-12">
              <TournamentsList 
                tournaments={mockTournaments}
                onPlaceBet={handlePlaceBet}
                isWalletConnected={walletInfo.connected}
              />
            </section>
            
            {/* My Bets section */}
            <section id="mybets" className="mb-12">
              <UserBets 
                bets={userBets}
                tournaments={mockTournaments}
                onWithdraw={handleWithdraw}
                isProcessing={isProcessing}
              />
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {walletInfo.connected && (
              <>
                {/* Token display widget */}
                <TokenDisplay tokens={walletInfo.tokens} />
                
                {/* Smart Contract Info */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                  <h2 className="text-white text-lg font-semibold mb-4">Smart Contract</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Betting Contract:</span>
                      <span className="text-gray-300 font-mono text-sm">0x1234...5678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token Contract:</span>
                      <span className="text-gray-300 font-mono text-sm">0x8765...4321</span>
                    </div>
                    <div className="pt-2">
                      <a 
                        href="#" 
                        className="text-[#00a8ff] hover:underline text-sm flex items-center"
                      >
                        View on Etherscan 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Leaderboard widget */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <h2 className="text-white text-lg font-semibold mb-4">Leaderboard</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#21262d] text-white text-xs font-semibold mr-2">
                        {index}
                      </div>
                      <span className="text-gray-300">Player{index}</span>
                    </div>
                    <span className="text-[#00f5d4] font-mono">{(6 - index) * 1.5} ETH</span>
                  </div>
                ))}
              </div>
              <a href="#" className="block text-center text-[#00a8ff] hover:underline mt-4 text-sm">
                View Full Leaderboard
              </a>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Transaction notification */}
      {showTxNotification && (
        <TransactionNotification 
          txHash={transactionHash} 
          onClose={() => setShowTxNotification(false)} 
        />
      )}
    </div>
  );
}

export default App;