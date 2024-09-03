import { useMemo } from "react";
import { ethers } from "ethers";
import useChain from "./useChain";
import { useConnectorAddress } from "./useConnectorAddress";

export function useContract() {
  const { provider, signer } = useChain();
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
      [
        "function lock(uint256 amount) payable",
        "event Locked(address indexed account, uint256 value)",
      ],
      provider
    );
    return contract.connect(signer);
  }, [provider, signer, nativeConnectorAddress]);

  const erc20MintingConnectorContract = useMemo(() => {
    let instance: ethers.Contract | undefined;

    if (!provider || !signer) {
      return instance;
    }
    const contract = new ethers.Contract(
      erc20MintingConnectorAddress!,
      [
        "function burn(uint256 amount) payable",
        "function lock() payable",
        "event Burned(address indexed account, uint256 value)",
        "event Funded(address indexed sender, address indexed connectorBase, uint256 amount)",
      ],
      provider
    );
    return contract.connect(signer);
  }, [erc20MintingConnectorAddress, provider, signer]);

  const erc20LockingConnectorContract = useMemo(() => {
    let instance: ethers.Contract | undefined;

    if (!provider || !signer || !erc20LockingConnectorAddress) {
      return instance;
    }
    const contract = new ethers.Contract(
      erc20LockingConnectorAddress!,
      ["function lock(uint256 value) payable"],
      provider
    );
    return contract.connect(signer);
  }, [erc20LockingConnectorAddress, provider, signer]);

  return {
    erc20MintingConnectorContract,
    erc20LockingConnectorContract,
    nativeConnectorContract,
  };
}
