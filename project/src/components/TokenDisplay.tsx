import React from 'react';
import { Token } from '../types';

interface TokenDisplayProps {
  tokens: Token[];
}

const TokenDisplay: React.FC<TokenDisplayProps> = React.memo(({ tokens }) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
      <h2 className="text-white text-lg font-semibold mb-4">Your Tokens</h2>
      
      <div className="space-y-3">
        {tokens.map((token) => (
          <div key={token.address} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
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
              <p className="text-gray-400 text-xs">{token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full bg-[#30363d] hover:bg-[#3c444d] text-white py-2 rounded-lg transition-colors">
        Add Custom Token
      </button>
    </div>
  );
});

export default TokenDisplay;