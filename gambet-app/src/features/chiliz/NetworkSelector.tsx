import React from 'react';
import { useChilizNetwork } from './useChilizNetwork';

export const NetworkSelector: React.FC = () => {
  const {
    currentChainId,
    isChilizNetwork,
    isSpicyTestnet,
    isMainnet,
    networkName,
    blockExplorerUrl,
    switchToSpicyTestnet,
    switchToMainnet,
  } = useChilizNetwork();

  const getNetworkColor = () => {
    if (isSpicyTestnet) return 'text-orange-400';
    if (isMainnet) return 'text-green-400';
    return 'text-red-400';
  };

  const getNetworkIcon = () => {
    if (isSpicyTestnet) return '🌶️';
    if (isMainnet) return '✅';
    return '❌';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">🌐 Red Chiliz</h3>
        <span className={`text-sm font-medium ${getNetworkColor()}`}>
          {getNetworkIcon()} {networkName}
        </span>
      </div>

      <div className="space-y-3">
        {/* Estado actual de la red */}
        <div className="text-sm">
          <span className="text-gray-400">Chain ID:</span>
          <span className="ml-2 font-mono text-gray-300">
            {currentChainId ? `0x${currentChainId.toString(16)}` : 'Desconocido'}
          </span>
        </div>

        {/* Botones para cambiar red */}
        <div className="flex space-x-2">
          <button
            onClick={switchToSpicyTestnet}
            disabled={isSpicyTestnet}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSpicyTestnet
                ? 'bg-orange-600 text-white cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            🌶️ Spicy Testnet
          </button>
          
          <button
            onClick={switchToMainnet}
            disabled={isMainnet}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isMainnet
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            ✅ Mainnet
          </button>
        </div>

        {/* Enlaces al explorador */}
        {blockExplorerUrl && (
          <div className="pt-2 border-t border-gray-700">
            <a
              href={blockExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              🔍 Ver en explorador
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Mensaje de estado */}
        {!isChilizNetwork && currentChainId && (
          <div className="text-yellow-400 text-sm bg-yellow-900 bg-opacity-20 p-2 rounded">
            ⚠️ No estás en una red Chiliz. Cambia a Spicy Testnet para continuar.
          </div>
        )}
      </div>
    </div>
  );
};
