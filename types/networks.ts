export interface Network {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  iconUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
export interface Networks {
  [key: number]: Network;
}

export const networks: Networks = {
  841: {
    chainId: 841,
    chainName: "Taraxa",
    rpcUrl: "https://rpc.mainnet.taraxa.io/",
    iconUrl: "https://community.taraxa.io/logo192.png",
    blockExplorerUrl: "https://mainnet.explorer.taraxa.io/",
    nativeCurrency: {
      name: "TARA",
      symbol: "TARA",
      decimals: 18,
    },
  },
  842: {
    chainId: 842,
    chainName: "Taraxa Testnet",
    rpcUrl: "https://rpc.testnet.taraxa.io/",
    iconUrl: "https://community.taraxa.io/logo192.png",
    blockExplorerUrl: "https://testnet.explorer.taraxa.io/",
    nativeCurrency: {
      name: "TARA",
      symbol: "TARA",
      decimals: 18,
    },
  },
  843: {
    chainId: 843,
    chainName: "Taraxa Devnet",
    rpcUrl: "https://rpc.devnet.taraxa.io/",
    iconUrl: "https://community.taraxa.io/logo192.png",
    blockExplorerUrl: "https://devnet.explorer.taraxa.io/",
    nativeCurrency: {
      name: "TARA",
      symbol: "TARA",
      decimals: 18,
    },
  },
  200: {
    chainId: 200,
    chainName: "Taraxa PRnet",
    rpcUrl: "https://rpc-pr-2815.prnet.taraxa.io",
    iconUrl: "https://community.taraxa.io/logo192.png",
    blockExplorerUrl: "https://devnet.explorer.taraxa.io/",
    nativeCurrency: {
      name: "TARA",
      symbol: "TARA",
      decimals: 18,
    },
  },
  1: {
    chainId: 1,
    chainName: "Ethereum",
    rpcUrl: "https://mainnet.infura.io/v3/f9ff70ed52a54593827ab62a291fdc01",
    iconUrl: "/ethereum-eth-logo-diamond-purple.svg",
    blockExplorerUrl: "https://etherscan.io/",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  17000: {
    chainId: 17000,
    chainName: "Ethereum Holesky",
    rpcUrl: "https://ethereum-holesky-rpc.publicnode.com",
    iconUrl: "/ethereum-eth-logo-diamond-purple.svg",
    blockExplorerUrl: "https://holesky.etherscan.io/",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
};
