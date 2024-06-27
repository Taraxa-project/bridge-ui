import { useCallback } from "react";
import { useNetworkProviders } from "./useNetworkProviders";
import {
  ETH_CHAIN_ID,
  TARA_CHAIN_ID,
  ethBridge,
  taraBridge,
} from "../types/addresses";
import { ethers } from "ethers";
import { ABIs } from "../types/abis";
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
      const abi = JSON.parse(ABIs.Bridge.abi);
      const contract = new ethers.Contract(
        config.contractAddress,
        abi,
        provider
      );
      console.log("Contract initialized:", contract);
      return contract;
    } catch (error) {
      console.error("Error creating contract instance:", error);
    }
  }, [provider, config.contractAddress]);

  return { provider, config, getBridgeContract };
};
