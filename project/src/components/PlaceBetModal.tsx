"use client"

import React, { useState, useEffect, useCallback } from "react"
import { X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"

interface PlaceBetModalProps {
  isOpen: boolean
  onClose: () => void
  teamName: string
  odds: number
  onPlaceBet: (amount: number) => Promise<string | null>
  isWalletConnected: boolean
}

const PlaceBetModal: React.FC<PlaceBetModalProps> = React.memo(
  ({ isOpen, onClose, teamName, odds, onPlaceBet, isWalletConnected }) => {
    const { t } = useLanguage()
    const [amount, setAmount] = useState<string>("0.01")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    // Calculate potential winnings
    const potentialWinnings = Number.parseFloat(amount) * odds

    // Close on escape key
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
      }
      window.addEventListener("keydown", handleEsc)
      return () => {
        window.removeEventListener("keydown", handleEsc)
      }
    }, [onClose])

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        if (!isWalletConnected) {
          setError("Please connect your wallet first")
          return
        }

        const betAmount = Number.parseFloat(amount)
        if (isNaN(betAmount) || betAmount <= 0) {
          setError("Please enter a valid amount")
          return
        }

        setIsSubmitting(true)
        try {
          const result = await onPlaceBet(betAmount)
          if (result) {
            setSuccess(true)
            setTimeout(() => {
              onClose()
            }, 2000)
          }
        } catch (err) {
          setError("Failed to place bet. Please try again.")
        } finally {
          setIsSubmitting(false)
        }
      },
      [amount, isWalletConnected, onPlaceBet, onClose],
    )

    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(e.target.value)
    }, [])

    const handleQuickBet = useCallback((amount: string) => {
      setAmount(amount)
    }, [])

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
        <div
          className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 w-full max-w-md relative animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="text-white text-xl font-bold mb-4">{t('place_bet')}</h3>

          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <p className="text-white text-lg font-semibold">Bet Placed Successfully!</p>
              <p className="text-gray-400 mt-2">Your bet has been confirmed</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Team</p>
                    <p className="text-white font-semibold">{teamName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Odds</p>
                    <p className="text-[#00f5d4] font-mono font-semibold">{odds.toFixed(2)}</p>
                  </div>
                </div>

                <label className="block text-gray-300 text-sm font-medium mb-2">Bet Amount (SOL)</label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={amount}
                    onChange={handleAmountChange}
                    className="bg-[#0d1117] border border-[#30363d] text-white w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ff]"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="flex justify-between mt-3 text-sm">
                  <button
                    type="button"
                    onClick={() => handleQuickBet("0.01")}
                    className="bg-[#21262d] text-white px-2 py-1 rounded"
                  >
                    0.01
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickBet("0.05")}
                    className="bg-[#21262d] text-white px-2 py-1 rounded"
                  >
                    0.05
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickBet("0.1")}
                    className="bg-[#21262d] text-white px-2 py-1 rounded"
                  >
                    0.1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickBet("0.5")}
                    className="bg-[#21262d] text-white px-2 py-1 rounded"
                  >
                    0.5
                  </button>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Potential winnings:</span>
                  <span className="text-white font-mono font-semibold">{potentialWinnings.toFixed(4)} SOL</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-900 bg-opacity-30 border border-red-800 text-red-200 px-4 py-2 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !isWalletConnected}
                className={`
                w-full py-3 rounded-lg font-semibold transition-all
                ${
                  isWalletConnected
                    ? "bg-gradient-to-r from-[#00a8ff] to-[#00f5d4] text-black hover:from-[#00a8ff] hover:to-[#00d8c6] transform hover:scale-[1.02]"
                    : "bg-gray-700 text-gray-300 cursor-not-allowed"
                }
              `}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </div>
                ) : !isWalletConnected ? (
                  t('connect_wallet_to_place_bet')
                ) : (
                  `${t('place_bet')} (${amount} SOL)`
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    )
  },
)

export default PlaceBetModal
