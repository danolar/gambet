export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
}

export interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}
