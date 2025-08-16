import React, { useState, useRef, useEffect } from 'react';
import { useChilizNetwork } from './useChilizNetwork';

export const NetworkSelectorCompact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    isChilizNetwork,
    isSpicyTestnet,
    isMainnet,
    switchToSpicyTestnet,
    switchToMainnet,
  } = useChilizNetwork();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNetworkIcon = () => {
    if (isSpicyTestnet) return '🌶️';
    if (isMainnet) return '✅';
    return '❌';
  };

  const getNetworkName = () => {
    if (isSpicyTestnet) return 'Spicy';
    if (isMainnet) return 'Mainnet';
    return 'Otra Red';
  };

  const handleNetworkSwitch = async (network: 'spicy' | 'mainnet') => {
    try {
      if (network === 'spicy') {
        await switchToSpicyTestnet();
      } else {
        await switchToMainnet();
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error al cambiar red:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
          isChilizNetwork
            ? 'border-green-500 bg-green-500 bg-opacity-10 text-green-400'
            : 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`}
      >
        <span className="text-lg">{getNetworkIcon()}</span>
        <span className="text-sm font-medium">{getNetworkName()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
              Redes Chiliz
            </div>
            
            <button
              onClick={() => handleNetworkSwitch('spicy')}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors ${
                isSpicyTestnet ? 'bg-orange-500 bg-opacity-20 text-orange-400' : 'text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🌶️</span>
                <div>
                  <div className="font-medium">Spicy Testnet</div>
                  <div className="text-xs text-gray-400">Chain ID: 88882</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleNetworkSwitch('mainnet')}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors ${
                isMainnet ? 'bg-green-500 bg-opacity-20 text-green-400' : 'text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">✅</span>
                <div>
                  <div className="font-medium">Mainnet</div>
                  <div className="text-xs text-gray-400">Chain ID: 88888</div>
                </div>
              </div>
            </button>

            {!isChilizNetwork && (
              <div className="px-4 py-2 text-xs text-yellow-400 bg-yellow-900 bg-opacity-20">
                ⚠️ Cambia a una red Chiliz para continuar
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
