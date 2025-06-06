"use client"

import React, { useCallback } from "react"
import type { WalletInfo } from "../types"
import { Menu, X } from "lucide-react"
import logo from "../assets/logo.jpg"
import WalletConnect from "./WalletConnect"
import LanguageToggle from "./LanguageToggle"
import { useLanguage } from "../context/LanguageContext"

interface HeaderProps {
  walletInfo: WalletInfo
  onConnect: () => void
  onDisconnect: () => void
  isConnecting: boolean
  modalMessage: string
  isModalOpen: boolean
  closeModal: () => void
  onLeaderboardClick?: () => void
  onHomePageClick?: () => void
}

const Header: React.FC<HeaderProps> = React.memo(
  ({
    walletInfo,
    onConnect,
    onDisconnect,
    isConnecting,
    modalMessage,
    isModalOpen,
    closeModal,
    onLeaderboardClick,
    onHomePageClick,
  }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const handleMenuToggle = useCallback(() => {
      setIsMenuOpen((prev) => !prev)
    }, [])

    const handleLinkClick = useCallback(() => {
      setIsMenuOpen(false)
    }, [])

    return (
      <header className="bg-[#0d1117] bg-opacity-95 backdrop-blur-md sticky top-0 z-50 border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center" onClick={onHomePageClick}>
              <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
              <span className="text-white font-bold text-xl">
                Ua<span className="text-[#00a8ff]">Dep</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#tournaments"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={handleLinkClick}
              >
                {useLanguage().t('tournaments')}
              </a>
              <a href="#mybets" className="text-gray-300 hover:text-white transition-colors" onClick={handleLinkClick}>
                {useLanguage().t('my_bets')}
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick()
                  if (onLeaderboardClick) onLeaderboardClick()
                }}
              >
                {useLanguage().t('leaderboard')}
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
              <LanguageToggle />
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={handleMenuToggle} className="text-gray-300 hover:text-white">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                {useLanguage().t('tournaments')}
              </a>
              <a
                href="#mybets"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#30363d] rounded-md"
                onClick={handleLinkClick}
              >
                {useLanguage().t('my_bets')}
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#30363d] rounded-md"
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick()
                  if (onLeaderboardClick) onLeaderboardClick()
                }}
              >
                {useLanguage().t('leaderboard')}
              </a>
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
              <LanguageToggle isMobile={true} />
            </div>
          </div>
        )}
      </header>
    )
  },
)

export default Header
