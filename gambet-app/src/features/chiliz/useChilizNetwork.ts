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

interface EthereumError {
  code: number;
  message: string;
}

export const useChilizNetwork = () => {
  const [networkState, setNetworkState] = useState<ChilizNetworkState>({
    currentChainId: null,
    isChilizNetwork: false,
    isSpicyTestnet: false,
    isMainnet: false,
    networkName: 'Not Connected',
    blockExplorerUrl: '',
  });

  const updateNetworkState = useCallback((chainId: number) => {
    const isSpicyTestnet = chainId === CHILIZ_SPICY_CONFIG.chainId;
    const isMainnet = chainId === CHILIZ_MAINNET_CONFIG.chainId;
    const isChilizNetwork = isSpicyTestnet || isMainnet;

    let networkName = 'Unknown Network';
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
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHILIZ_SPICY_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: unknown) {
      const error = switchError as EthereumError;
      // If the network doesn't exist, add it
      if (error.code === 4902) {
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
        } catch {
          throw new Error('Error adding Chiliz Spicy Testnet');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  const switchToMainnet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHILIZ_MAINNET_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: unknown) {
      const error = switchError as EthereumError;
      if (error.code === 4902) {
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
        } catch {
          throw new Error('Error adding Chiliz Mainnet');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  // Listen for network changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('MetaMask not available');
      return;
    }

    const ethereum = window.ethereum;

    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed to:', chainId);
      updateNetworkState(parseInt(chainId, 16));
    };

    const handleAccountsChanged = () => {
      console.log('Accounts changed, reloading page');
      window.location.reload();
    };

    const handleConnect = () => {
      console.log('Wallet connected');
      // Get current chain ID when wallet connects
      ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
        console.log('Current chain ID:', chainId);
        updateNetworkState(parseInt(chainId, 16));
      }).catch(console.error);
    };

    const handleDisconnect = () => {
      console.log('Wallet disconnected');
      setNetworkState({
        currentChainId: null,
        isChilizNetwork: false,
        isSpicyTestnet: false,
        isMainnet: false,
        networkName: 'Not Connected',
        blockExplorerUrl: '',
      });
    };

    // Add event listeners
    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('connect', handleConnect);
    ethereum.on('disconnect', handleDisconnect);

    // Get current chain ID
    ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
      console.log('Initial chain ID:', chainId);
      updateNetworkState(parseInt(chainId, 16));
    }).catch((error) => {
      console.error('Error getting chain ID:', error);
      // Set default state if there's an error
      setNetworkState({
        currentChainId: null,
        isChilizNetwork: false,
        isSpicyTestnet: false,
        isMainnet: false,
        networkName: 'Not Connected',
        blockExplorerUrl: '',
      });
    });

    return () => {
      ethereum.removeListener('chainChanged', handleChainChanged);
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('connect', handleConnect);
      ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, [updateNetworkState]);

  return {
    ...networkState,
    switchToSpicyTestnet,
    switchToMainnet,
  };
};
