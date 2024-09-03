import { useMemo } from "react";
import { useBridgeNetwork } from "../context/bridge-network";
import { networkConfigs } from "@/config/networkConfig";

export type ConnectorType = "native" | "erc20Minting" | "erc20Locking";

export function useConnectorAddress(connectorType: ConnectorType) {
  const { fromNetwork } = useBridgeNetwork();

  const connectorAddress = useMemo(() => {
    const networkConfig = networkConfigs[fromNetwork.chainId];
    if (!networkConfig) {
      throw new Error(
        `No configuration found for network with chain ID ${fromNetwork.chainId}`
      );
    }
    return networkConfig.connectorAddresses[connectorType];
  }, [fromNetwork.chainId, connectorType]);

  return connectorAddress;
}
