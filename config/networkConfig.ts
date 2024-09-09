import {
  TARA_CHAIN_ID,
  ETH_CHAIN_ID,
} from "@/types/addresses";

type NetworkConfig = {
  chainId: number;
};

type NetworkConfigs = {
  [chainId: string]: NetworkConfig;
};

export const networkConfigs: NetworkConfigs = {
  [TARA_CHAIN_ID]: {
    chainId: TARA_CHAIN_ID,
  },
  [ETH_CHAIN_ID]: {
    chainId: ETH_CHAIN_ID,
  },
};
