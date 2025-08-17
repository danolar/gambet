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
          <div className="text-sm text-[#8fef70] font-medium">
            {balanceFormatted} {currencySymbol}
          </div>
          <div className="text-xs text-white/70">
            {formatAddress(address || '')}
          </div>
        </div>
        <button
          onClick={disconnect}
          className="bg-[#131549] hover:bg-[#131549]/80 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 border border-[#8fef70]/30 hover:border-[#8fef70]/50 hover:shadow-[0_0_20px_rgba(143,239,112,0.3)]"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="group relative bg-gradient-to-r from-[#8fef70] to-[#131549] text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(143,239,112,0.3)] transition-all duration-300 hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      {error && (
        <div className="text-red-400 text-xs text-center max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
};
