export const erc20TaraMintingConnectorAddress: string =
  process.env.NEXT_PUBLIC_TARA_ERC20_MINTING_CONNECTOR_ADDRESS || "";
export const erc20EthMintingConnectorAddress: string =
  process.env.NEXT_PUBLIC_ETH_ERC20_MINTING_CONNECTOR_ADDRESS || "";
export const erc20UsdtMintingConnectorAddress: string =
  process.env.NEXT_PUBLIC_USDT_ERC20_MINTING_CONNECTOR_ADDRESS || "";
  export const erc20UsdtLockingConnectorAddress: string =
  process.env.NEXT_PUBLIC_USDT_ERC20_LOCKING_CONNECTOR_ADDRESS || "";

export const taraConnectorAddress: string =
  process.env.NEXT_PUBLIC_TARA_CONNECTOR_ADDRESS || "";
export const ethConnectorAddress: string =
  process.env.NEXT_PUBLIC_ETH_CONNECTOR_ADDRESS || "";

export const wrappedTaraxaTokenAddress: string =
  process.env.NEXT_PUBLIC_WTARA_TOKEN_ADDRESS || "";

export const wrappedEthTokenAddress: string =
  process.env.NEXT_PUBLIC_WETH_TOKEN_ADDRESS || "";

export const wrappedUsdtTokenAddress: string =
  process.env.NEXT_PUBLIC_WUSDT_TOKEN_ADDRESS || "";

export const TARA_CHAIN_ID = 841;
export const ETH_CHAIN_ID = 1;

export const ethBridge = process.env.NEXT_PUBLIC_ETH_BRIDGE_ADDRESS || "";
export const taraBridge = process.env.NEXT_PUBLIC_TARA_BRIDGE_ADDRESS || "";