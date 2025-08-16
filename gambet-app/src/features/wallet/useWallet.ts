import { useState, useCallback } from 'react';
import type { WalletState, WalletActions } from './types';

export const useWallet = (): WalletState & WalletActions => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    isConnecting: false,
    error: null,
  });

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

      setState({
        isConnected: true,
        address: account,
        chainId: parseInt(chainId, 16),
        balance: balance,
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
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
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

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
  };
};
