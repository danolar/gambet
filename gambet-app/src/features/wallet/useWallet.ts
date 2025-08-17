import { useState, useCallback, useEffect } from 'react';
import type { WalletState, WalletActions } from './types';
import { CHILIZ_SPICY_CONFIG, CHILIZ_MAINNET_CONFIG } from '../chiliz/config';

export const useWallet = (): WalletState & WalletActions => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    balanceFormatted: null,
    currencySymbol: null,
    isConnecting: false,
    error: null,
  });

  const getCurrencyInfo = useCallback((chainId: number) => {
    if (chainId === CHILIZ_SPICY_CONFIG.chainId || chainId === CHILIZ_MAINNET_CONFIG.chainId) {
      return {
        symbol: 'CHZ',
        decimals: 18,
        name: 'Chiliz'
      };
    }
    // Por defecto asumimos ETH
    return {
      symbol: 'ETH',
      decimals: 18,
      name: 'Ethereum'
    };
  }, []);

  const formatBalance = useCallback((balance: string, decimals: number) => {
    const balanceInWei = parseInt(balance, 16);
    const balanceInTokens = balanceInWei / Math.pow(10, decimals);
    return balanceInTokens.toFixed(4);
  }, []);

  // Función para verificar y establecer el estado de la billetera
  const checkWalletConnection = useCallback(async () => {
    try {
      console.log('Checking wallet connection...');
      
      if (!window.ethereum) {
        console.log('No ethereum provider found');
        return;
      }

      console.log('Ethereum provider found, checking accounts...');

      // Verificar si ya hay cuentas conectadas
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      console.log('Accounts found:', accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log('Account found:', account);
        
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        console.log('Chain ID:', chainId);

        // Obtener balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });

        const chainIdNumber = parseInt(chainId, 16);
        const currencyInfo = getCurrencyInfo(chainIdNumber);
        const balanceFormatted = formatBalance(balance, currencyInfo.decimals);

        console.log('Setting wallet state to connected:', {
          account,
          chainIdNumber,
          balanceFormatted,
          currencySymbol: currencyInfo.symbol
        });

        setState({
          isConnected: true,
          address: account,
          chainId: chainIdNumber,
          balance: balance,
          balanceFormatted: balanceFormatted,
          currencySymbol: currencyInfo.symbol,
          isConnecting: false,
          error: null,
        });
      } else {
        console.log('No accounts found, wallet not connected');
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }, [getCurrencyInfo, formatBalance]);

  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      // Verificar si MetaMask está disponible
      if (!window.ethereum) {
        throw new Error('MetaMask no está instalado');
      }

      // Solicitar conexión
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const account = accounts[0];
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      // Obtener balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });

      const chainIdNumber = parseInt(chainId, 16);
      const currencyInfo = getCurrencyInfo(chainIdNumber);
      const balanceFormatted = formatBalance(balance, currencyInfo.decimals);

      setState({
        isConnected: true,
        address: account,
        chainId: chainIdNumber,
        balance: balance,
        balanceFormatted: balanceFormatted,
        currencySymbol: currencyInfo.symbol,
        isConnecting: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, [getCurrencyInfo, formatBalance]);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      balanceFormatted: null,
      currencySymbol: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask no está instalado');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al cambiar red',
      }));
    }
  }, []);

  // Verificar conexión inicial al cargar el componente
  useEffect(() => {
    console.log('useWallet: Initializing...');
    console.log('useWallet: window.ethereum available:', typeof window !== 'undefined' && !!window.ethereum);
    
    if (typeof window !== 'undefined' && window.ethereum) {
      checkWalletConnection();
    } else {
      console.log('useWallet: No ethereum provider available');
    }
  }, [checkWalletConnection]);

  // Escuchar cambios de red y actualizar balance
  useEffect(() => {
    if (!window.ethereum || !state.address) return;

    const handleChainChanged = async (chainId: string) => {
      const chainIdNumber = parseInt(chainId, 16);
      const currencyInfo = getCurrencyInfo(chainIdNumber);
      
      try {
        const balance = await window.ethereum!.request({
          method: 'eth_getBalance',
          params: [state.address, 'latest'],
        });
        
        const balanceFormatted = formatBalance(balance, currencyInfo.decimals);
        
        setState(prev => ({
          ...prev,
          chainId: chainIdNumber,
          balance: balance,
          balanceFormatted: balanceFormatted,
          currencySymbol: currencyInfo.symbol,
        }));
      } catch (error) {
        console.error('Error al obtener balance:', error);
      }
    };

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Usuario desconectó la billetera
        disconnect();
      } else {
        // Usuario cambió de cuenta, recargar datos
        checkWalletConnection();
      }
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [state.address, getCurrencyInfo, formatBalance, disconnect, checkWalletConnection]);

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
  };
};
