"use client";

import { ethers } from "ethers";
import { useMemo } from "react";
import { TARA_CHAIN_ID, ETH_CHAIN_ID } from "@/types/addresses";
import { networks } from "../types/networks";

export type NetworkProvider = {
  [chainId: number]: ethers.providers.JsonRpcProvider | null;
};

export const useNetworkProviders = () => {
  const taraMainnetProvider = useMemo(() => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        networks[TARA_CHAIN_ID]?.rpcUrl
      );
      return provider;
    } catch (error) {
      console.error("Error initializing TARA provider:", error);
      return null;
    }
  }, []);
  const ethMainnetProvider = useMemo(() => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        networks[ETH_CHAIN_ID]?.rpcUrl
      );
      return provider;
    } catch (error) {
      console.error("Error initializing ETH provider:", error);
      return null;
    }
  }, []);

  const networkProviders: NetworkProvider = {
    [TARA_CHAIN_ID]: taraMainnetProvider,
    [ETH_CHAIN_ID]: ethMainnetProvider,
  };

  return {
    taraMainnetProvider,
    ethMainnetProvider,
    networkProviders,
  };
};
