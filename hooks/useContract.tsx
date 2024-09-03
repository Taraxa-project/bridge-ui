import { useMemo } from "react";
import { ethers } from "ethers";
import { ABIs } from "@/types/abis";
import useChain from "./useChain";
import { useConnectorAddress } from "./useConnectorAddress";

export function useContract() {
  const { provider, signer } = useChain();
  const erc20MintingConnectorAbi = ABIs.ERC20MintingConnector.abi;
  const erc20LockingConnectorAbi = ABIs.ERC20LockingConnector.abi;
  const nativeConnectorAbi = ABIs.NativeConnector.abi;
  const nativeConnectorAddress = useConnectorAddress("native");
  const erc20MintingConnectorAddress = useConnectorAddress("erc20Minting");
  const erc20LockingConnectorAddress = useConnectorAddress("erc20Locking");

  const nativeConnectorContract = useMemo(() => {
    let instance: ethers.Contract | undefined;

    if (!provider || !signer) {
      return instance;
    }
    const contract = new ethers.Contract(
      nativeConnectorAddress!,
      nativeConnectorAbi,
      provider
    );
    return contract.connect(signer);
  }, [provider, signer, nativeConnectorAddress, nativeConnectorAbi]);

  const erc20MintingConnectorContract = useMemo(() => {
    let instance: ethers.Contract | undefined;

    if (!provider || !signer) {
      return instance;
    }
    const contract = new ethers.Contract(
      erc20MintingConnectorAddress!,
      erc20MintingConnectorAbi,
      provider
    );
    return contract.connect(signer);
  }, [
    erc20MintingConnectorAbi,
    erc20MintingConnectorAddress,
    provider,
    signer,
  ]);

  const erc20LockingConnectorContract = useMemo(() => {
    let instance: ethers.Contract | undefined;

    if (!provider || !signer || !erc20LockingConnectorAddress) {
      return instance;
    }
    const contract = new ethers.Contract(
      erc20LockingConnectorAddress!,
      erc20LockingConnectorAbi,
      provider
    );
    return contract.connect(signer);
  }, [
    erc20LockingConnectorAbi,
    erc20LockingConnectorAddress,
    provider,
    signer,
  ]);

  return {
    erc20MintingConnectorContract,
    erc20LockingConnectorContract,
    nativeConnectorContract,
  };
}
