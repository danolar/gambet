import { useState, useCallback, useEffect } from 'react';
import { CHILIZ_SPICY_CONFIG, CHILIZ_MAINNET_CONFIG } from './config';

export interface ChilizNetworkState {
  currentChainId: number | null;
  isChilizNetwork: boolean;
  isSpicyTestnet: boolean;
  isMainnet: boolean;
  networkName: string;
  blockExplorerUrl: string;
}

export const useChilizNetwork = () => {
  const [networkState, setNetworkState] = useState<ChilizNetworkState>({
    currentChainId: null,
    isChilizNetwork: false,
    isSpicyTestnet: false,
    isMainnet: false,
    networkName: '',
    blockExplorerUrl: '',
  });

  const updateNetworkState = useCallback((chainId: number) => {
    const isSpicyTestnet = chainId === CHILIZ_SPICY_CONFIG.chainId;
    const isMainnet = chainId === CHILIZ_MAINNET_CONFIG.chainId;
    const isChilizNetwork = isSpicyTestnet || isMainnet;

    let networkName = 'Red Desconocida';
    let blockExplorerUrl = '';

    if (isSpicyTestnet) {
      networkName = CHILIZ_SPICY_CONFIG.chainName;
      blockExplorerUrl = CHILIZ_SPICY_CONFIG.blockExplorers.default.url;
    } else if (isMainnet) {
      networkName = CHILIZ_MAINNET_CONFIG.chainName;
      blockExplorerUrl = CHILIZ_MAINNET_CONFIG.blockExplorers.default.url;
    }

    setNetworkState({
      currentChainId: chainId,
      isChilizNetwork,
      isSpicyTestnet,
      isMainnet,
      networkName,
      blockExplorerUrl,
    });
  }, []);

  const switchToSpicyTestnet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHILIZ_SPICY_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Si la red no existe, la agregamos
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${CHILIZ_SPICY_CONFIG.chainId.toString(16)}`,
                chainName: CHILIZ_SPICY_CONFIG.chainName,
                nativeCurrency: CHILIZ_SPICY_CONFIG.nativeCurrency,
                rpcUrls: CHILIZ_SPICY_CONFIG.rpcUrls.default.http,
                blockExplorerUrls: [CHILIZ_SPICY_CONFIG.blockExplorers.default.url],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Error al agregar la red Chiliz Spicy Testnet');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  const switchToMainnet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHILIZ_MAINNET_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${CHILIZ_MAINNET_CONFIG.chainId.toString(16)}`,
                chainName: CHILIZ_MAINNET_CONFIG.chainName,
                nativeCurrency: CHILIZ_MAINNET_CONFIG.nativeCurrency,
                rpcUrls: CHILIZ_MAINNET_CONFIG.rpcUrls.default.http,
                blockExplorerUrls: [CHILIZ_MAINNET_CONFIG.blockExplorers.default.url],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Error al agregar la red Chiliz Mainnet');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  // Escuchar cambios de red
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = (chainId: string) => {
      updateNetworkState(parseInt(chainId, 16));
    };

    const handleAccountsChanged = () => {
      // Recargar la página cuando cambien las cuentas
      window.location.reload();
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Obtener el chainId actual
    window.ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
      updateNetworkState(parseInt(chainId, 16));
    });

    return () => {
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [updateNetworkState]);

  return {
    ...networkState,
    switchToSpicyTestnet,
    switchToMainnet,
  };
};
