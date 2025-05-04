import React, { useEffect, useState, memo } from 'react';
import { CheckCircle2, X, ExternalLink } from 'lucide-react';

interface TransactionNotificationProps {
  txHash: string | null;
  onClose: () => void;
}

const TransactionNotification: React.FC<TransactionNotificationProps> = memo(({ 
  txHash, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (txHash) {
      setIsVisible(true);
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow animation to complete
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [txHash, onClose]);
  
  if (!txHash) return null;
  
  return (
    <div 
      className={`
        fixed bottom-4 right-4 bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-4 max-w-md w-full
        transform transition-all duration-300 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-white">Transaction Successful</p>
          <p className="mt-1 text-sm text-gray-400">
            Your transaction has been confirmed on the blockchain.
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-400">
            <a 
              href={`https://etherscan.io/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-[#00a8ff] transition-colors"
            >
              <span className="truncate max-w-[200px]">{txHash}</span>
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
});

export default TransactionNotification;