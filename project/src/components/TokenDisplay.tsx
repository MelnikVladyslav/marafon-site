import React from "react"
import type { Token } from "../types"
import { useLanguage } from "../context/LanguageContext"

interface TokenDisplayProps {
  tokens: Token[]
  t?: (key: string) => string
}

const TokenDisplay: React.FC<TokenDisplayProps> = React.memo(({ tokens, t }) => {
  // Use provided translation function or get from context
  const { t: contextT } = useLanguage();
  const translate = t || contextT;
  if (!tokens) {
    console.log("Tokens:", tokens)
    return <div>{translate('no_tokens_available')}</div>
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
      <h2 className="text-white text-lg font-semibold mb-4">{translate('your_tokens')}</h2>

      <div className="space-y-3">
        {tokens.map((token) => (
          <div
            key={token.address}
            className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-[#30363d]"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#00a8ff] to-[#9d4edd] flex items-center justify-center text-white font-mono">
                {token.symbol.substring(0, 1)}
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{token.name}</p>
                <p className="text-gray-400 text-sm">{token.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#00f5d4] font-mono font-semibold">{token.balance.toLocaleString()}</p>
              <p className="text-gray-400 text-xs">
                {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full bg-[#30363d] hover:bg-[#3c444d] text-white py-2 rounded-lg transition-colors">
        {translate('add_custom_token')}
      </button>
    </div>
  )
})

export default TokenDisplay
