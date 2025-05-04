import React from 'react';
import { WalletInfo } from '../types';
import { Gamepad2, Trophy, Menu, X } from 'lucide-react';
import WalletConnect from './WalletConnect';

interface HeaderProps {
  walletInfo: WalletInfo;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  walletInfo, 
  onConnect, 
  onDisconnect, 
  isConnecting 
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-[#0d1117] bg-opacity-95 backdrop-blur-md sticky top-0 z-50 border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Gamepad2 className="h-8 w-8 text-[#00f5d4] mr-2" />
            <span className="text-white font-bold text-xl">Ua<span className="text-[#00a8ff]">Dep</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#tournaments" className="text-gray-300 hover:text-white transition-colors">
              Tournaments
            </a>
            <a href="#mybets" className="text-gray-300 hover:text-white transition-colors">
              My Bets
            </a>
            <a href="#leaderboard" className="text-gray-300 hover:text-white transition-colors">
              Leaderboard
            </a>
            <WalletConnect 
              walletInfo={walletInfo}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              isConnecting={isConnecting}
            />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#161b22] border-t border-[#30363d]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="#tournaments" 
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#30363d] rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Tournaments
            </a>
            <a 
              href="#mybets" 
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#30363d] rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              My Bets
            </a>
            <a 
              href="#leaderboard" 
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#30363d] rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </a>
            <div className="px-3 py-2">
              <WalletConnect 
                walletInfo={walletInfo}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                isConnecting={isConnecting}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;