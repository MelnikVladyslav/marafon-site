"use client"

import { useState, useEffect } from "react"
import { X, Check, ExternalLink } from "lucide-react"

interface TransactionNotificationProps {
  txHash: string | null
  onClose: () => void
}

const TransactionNotification = ({ txHash, onClose }: TransactionNotificationProps) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // Allow time for fade-out animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  // Get Solana Explorer URL for the transaction
  const getExplorerUrl = (hash: string) => {
    return `https://explorer.solana.com/tx/${hash}?cluster=devnet`
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-4 max-w-md transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <div className="h-10 w-10 rounded-full bg-[#14F195]/20 flex items-center justify-center">
            <Check className="h-6 w-6 text-[#14F195]" />
          </div>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-white">Transaction Submitted</p>
          <p className="mt-1 text-sm text-gray-400">Your transaction has been submitted to the Solana network.</p>
          {txHash && (
            <a
              href={getExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center text-xs text-[#9945FF] hover:underline"
            >
              View on Solana Explorer
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(onClose, 300)
          }}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default TransactionNotification
