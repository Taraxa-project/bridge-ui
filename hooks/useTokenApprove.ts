import { BigNumber, ethers } from "ethers";
import { useCallback, useState } from "react";
import { useWalletPopup } from "../context/wallet-popup";
import { useBridgeNetwork } from "../context/bridge-network";
import useChain from "./useChain";
import { useConnection } from "./useConnection";

export const useTokenApprove = () => {
  const { coin } = useBridgeNetwork();
  const { asyncCallback } = useWalletPopup();
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { provider, signer } = useChain();
  const decimals = coin?.decimals || 18;
  const { account } = useConnection();

  const getAllowance = async (spender: string, contract: ethers.Contract) => {
    return await contract.allowance(account, spender);
  };

  const onApprove = useCallback(
    async (
      spender: string,
      amount: BigNumber,
      contract: ethers.Contract
    ): Promise<ethers.providers.TransactionResponse> => {
      return await contract.approve(spender, amount);
    },
    []
  );

  const approve = async (
    spender: string,
    amount: ethers.BigNumberish,
    onSuccess: () => void,
    onFail: () => void
  ) => {
    const coinContract = await getCoinContract();
    if (!coinContract) {
      setStatus("Fail");
      setError("Contract not available");
      return;
    }
    const valueInSmallestUnit = ethers.utils.parseUnits(
      amount.toString(),
      decimals
    );
    const currentAllowance = await getAllowance(spender, coinContract);
    if (currentAllowance.gte(valueInSmallestUnit)) {
      setStatus("Approve successful");
      setError("");
      onSuccess();
      return;
    }
    asyncCallback(
      async () => {
        return await onApprove(spender, valueInSmallestUnit, coinContract);
      },
      () => {
        setStatus("Approve successful");
        setError("");
        onSuccess();
      },
      () => {
        setStatus("Fail");
        setError("Transaction failed");
        onFail();
      }
    );
  };

  const getCoinContract = async () => {
    let instance: ethers.Contract | undefined;

    if (!provider || !signer) {
      return instance;
    }
    const contractAddress = coin?.deployAddress;
    if (!contractAddress) {
      setStatus("Fail");
      setError("Contract address missing from coin");
      return;
    }
    const contract = new ethers.Contract(
      contractAddress,
      [
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 value) returns (bool)",
        "function balanceOf(address account) view returns (uint256)",
        "function totalSupply() view returns (uint256)",
        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint256 value) returns (bool)",
      ],
      provider
    );
    return contract.connect(signer);
  };

  return { status, error, approve };
};
