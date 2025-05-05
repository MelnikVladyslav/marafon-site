import React, { useCallback } from 'react';
import { WalletInfo } from '../types';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.jpg';
import WalletConnect from './WalletConnect';

interface HeaderProps {
  walletInfo: WalletInfo;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
  modalMessage: string;
  isModalOpen: boolean;
  closeModal: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(({ 
  walletInfo, 
  onConnect, 
  onDisconnect, 
  isConnecting,
  modalMessage,
  isModalOpen,
  closeModal 
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="bg-[#0d1117] bg-opacity-95 backdrop-blur-md sticky top-0 z-50 border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
            <span className="text-white font-bold text-xl">Ua<span className="text-[#00a8ff]">Dep</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#tournaments" className="text-gray-300 hover:text-white transition-colors" onClick={handleLinkClick}>
              Tournaments
            </a>
            <a href="#mybets" className="text-gray-300 hover:text-white transition-colors" onClick={handleLinkClick}>
              My Bets
            </a>
            <a href="#leaderboard" className="text-gray-300 hover:text-white transition-colors" onClick={handleLinkClick}>
              Leaderboard
            </a>
            <WalletConnect 
              walletInfo={walletInfo}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              isConnecting={isConnecting}
              modalMessage={modalMessage}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
            />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleMenuToggle}
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
              onClick={handleLinkClick}
            >
              Tournaments
            </a>
            <a 
              href="#mybets" 
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#30363d] rounded-md"
              onClick={handleLinkClick}
            >
              My Bets
            </a>
            <a 
              href="#leaderboard" 
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#30363d] rounded-md"
              onClick={handleLinkClick}
            >
              Leaderboard
            </a>
            <div className="px-3 py-2">
              <WalletConnect 
                walletInfo={walletInfo}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                isConnecting={isConnecting}
                modalMessage={modalMessage}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

export default Header;