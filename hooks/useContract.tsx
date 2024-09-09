import { useMemo } from "react";
import { ethers } from "ethers";
import useChain from "./useChain";
import { useBridgeNetwork } from "@/context/bridge-network";

export function useContract() {
  const { provider, signer } = useChain();
  const { coin } = useBridgeNetwork();

  const nativeConnectorContract = useMemo(() => {
    let instance: ethers.Contract | undefined;
    const connectorAddress = coin?.connectorAddress;

    if (!provider || !signer || !connectorAddress) {
      return instance;
    }
    const contract = new ethers.Contract(
      connectorAddress!,
      ["function lock(uint256 amount) payable"],
      provider
    );
    return contract.connect(signer);
  }, [coin, provider, signer]);

  const erc20MintingConnectorContract = useMemo(() => {
    let instance: ethers.Contract | undefined;
    const connectorAddress = coin?.connectorAddress;

    if (!provider || !signer || !connectorAddress) {
      return instance;
    }
    const contract = new ethers.Contract(
      connectorAddress!,
      ["function burn(uint256 amount) payable", "function lock() payable"],
      provider
    );
    return contract.connect(signer);
  }, [coin, provider, signer]);

  const erc20LockingConnectorContract = useMemo(() => {
    let instance: ethers.Contract | undefined;
    const connectorAddress = coin?.connectorAddress;

    if (!provider || !signer || !connectorAddress) {
      return instance;
    }
    const contract = new ethers.Contract(
      connectorAddress!,
      ["function lock(uint256 value) payable"],
      provider
    );
    return contract.connect(signer);
  }, [coin, provider, signer]);

  return {
    erc20MintingConnectorContract,
    erc20LockingConnectorContract,
    nativeConnectorContract,
  };
}
