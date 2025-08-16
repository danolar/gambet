export const CHILIZ_SPICY_CONFIG = {
  chainId: 88882,
  chainName: 'Chiliz Spicy Testnet',
  nativeCurrency: {
    name: 'CHZ',
    symbol: 'CHZ',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://spicy-rpc.chiliz.com/'],
      webSocket: ['wss://spicy-rpc-ws.chiliz.com/'],
    },
    public: {
      http: [
        'https://spicy-rpc.chiliz.com/',
        'https://chiliz-testnet.gateway.tatum.io',
        'https://chiliz-spicy.publicnode.com/',
      ],
      webSocket: [
        'wss://spicy-rpc-ws.chiliz.com/',
        'wss://chiliz-spicy.publicnode.com/',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'ChiliScan Testnet',
      url: 'https://testnet.chiliscan.com/',
    },
    alternative: {
      name: 'Spicy Explorer',
      url: 'https://spicy-explorer.chiliz.com/',
    },
  },
  testnet: true,
} as const;

export const CHILIZ_MAINNET_CONFIG = {
  chainId: 88888,
  chainName: 'Chiliz Chain',
  nativeCurrency: {
    name: 'CHZ',
    symbol: 'CHZ',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.chiliz.com/'],
      webSocket: ['wss://rpc-ws.chiliz.com/'],
    },
    public: {
      http: ['https://rpc.chiliz.com/'],
      webSocket: ['wss://rpc-ws.chiliz.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ChiliScan',
      url: 'https://explorer.chiliz.com/',
    },
  },
  testnet: false,
} as const;
