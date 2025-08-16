import React from 'react';
import { useWallet } from './useWallet';

export const WalletButton: React.FC = () => {
  const { 
    isConnected, 
    address, 
    balanceFormatted, 
    currencySymbol,
    isConnecting, 
    error, 
    connect, 
    disconnect 
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-sm text-gray-300">
            {balanceFormatted} {currencySymbol}
          </div>
          <div className="text-xs text-gray-400">
            {formatAddress(address || '')}
          </div>
        </div>
        <button
          onClick={disconnect}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        {isConnecting ? 'Conectando...' : '🔗 Conectar Wallet'}
      </button>
      
      {error && (
        <div className="text-red-400 text-xs text-center max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
};
