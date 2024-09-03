import { useCallback } from "react";
import { useNetworkProviders } from "./useNetworkProviders";
import {
  ETH_CHAIN_ID,
  TARA_CHAIN_ID,
  ethBridge,
  taraBridge,
} from "../types/addresses";
import { ethers } from "ethers";
import { BridgeNetwork } from "../types/bridge-networks";

type AddressDetails = {
  chainId: number;
  contractAddress: string;
  seconds: number;
};

type ChainAddress = {
  [chainId: number]: AddressDetails;
};

const chainAddresses: ChainAddress = {
  [TARA_CHAIN_ID]: {
    chainId: TARA_CHAIN_ID,
    contractAddress: taraBridge,
    seconds: 3.4,
  },
  [ETH_CHAIN_ID]: {
    chainId: ETH_CHAIN_ID,
    contractAddress: ethBridge,
    seconds: 10,
  },
};

export const useBridgeContract = (network: BridgeNetwork) => {
  const { networkProviders } = useNetworkProviders();

  const provider = networkProviders[network.chainId];
  const config = chainAddresses[network.chainId];

  const getBridgeContract = useCallback(async () => {
    if (!provider || !ethers.utils.isAddress(config.contractAddress)) {
      console.error("Invalid provider or contract address.");
      return;
    }

    try {
      const contract = new ethers.Contract(
        config.contractAddress,
        [
          "function finalizationInterval() view returns (uint256)",
          "function lastFinalizedBlock() view returns (uint256)",
          "function appliedEpoch() view returns (uint256)",
          "function settlementFee() view returns (uint256)",
        ],
        provider
      );
      return contract;
    } catch (error) {
      console.error("Error creating contract instance:", error);
    }
  }, [provider, config.contractAddress]);

  const getSettlementFee = useCallback(async () => {
    const bridgeContract = await getBridgeContract();
    return bridgeContract?.settlementFee();
  }, [getBridgeContract]);

  return { provider, config, getBridgeContract, getSettlementFee };
};
