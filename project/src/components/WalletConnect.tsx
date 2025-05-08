"use client"

import React, { useCallback } from "react"
import type { WalletInfo } from "../types"
import { Wallet, LogOut, Loader2 } from "lucide-react"
import Modal from "./Modal"
import { useLanguage } from "../context/LanguageContext"

interface WalletConnectProps {
  walletInfo: WalletInfo
  onConnect: () => void // Функція для підключення гаманця
  onDisconnect: () => void
  isConnecting: boolean
  modalMessage: string
  isModalOpen: boolean
  closeModal: () => void
  isMobile?: boolean
}

const WalletConnect: React.FC<WalletConnectProps> = React.memo(
  ({ walletInfo, onConnect, onDisconnect, isConnecting, modalMessage, isModalOpen, closeModal, isMobile }) => {
    // Get translation function
    const { t } = useLanguage();
    // Форматування адреси гаманця для відображення
    const formatAddress = (address: string) => {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    }

    const handleConnect = useCallback(() => {
      onConnect() // Виклик функції підключення
    }, [onConnect])

    const handleDisconnect = useCallback(() => {
      onDisconnect()
    }, [onDisconnect])

    return (
      <div className={isMobile ? "w-full" : ""}>
        {walletInfo.connected ? (
          <div className="flex items-center">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-full py-1 px-3 flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-gray-300 mr-2">{formatAddress(walletInfo.address)}</span>
              <span className="text-[#00f5d4] font-mono">{walletInfo.balance.toFixed(4)} SOL</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="ml-2 text-red-400 hover:text-red-300 bg-[#24292e] hover:bg-[#2d333b] p-2 rounded-full transition-colors"
              title={t('disconnect')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`bg-gradient-to-r from-[#00a8ff] to-[#00f5d4] hover:from-[#00a8ff] hover:to-[#00d8c6]
            text-black font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105
            ${isMobile ? "w-full" : ""}
          `}
          >
            {isConnecting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                {t('connecting')}
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                {t('connect_wallet')}
              </>
            )}
          </button>
        )}

        {/* Відображення модального вікна */}
        <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
      </div>
    )
  },
)

export default WalletConnect
