import { ethers, utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContract } from "./useContract";
import { useConnection } from "./useConnection";
import { useBridgeContract } from "./useBridgeContract";
import { useWalletPopup } from "@/context/wallet-popup";
import { useBridgeNetwork } from "@/context/bridge-network";
import { useTokenApprove } from "./useTokenApprove";

export const useLock = () => {
  const { account } = useConnection();
  const { erc20LockingConnectorContract } = useContract();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { approve } = useTokenApprove();

  const { asyncCallback } = useWalletPopup();

  const { fromNetwork, coin } = useBridgeNetwork();
  const { getBridgeContract } = useBridgeContract(fromNetwork);

  const onLock = useCallback(
    async (amount: number): Promise<ethers.providers.TransactionResponse> => {
      const bridgeContract = await getBridgeContract();
      const settlementFee = await bridgeContract!.settlementFee();

      return await erc20LockingConnectorContract!.lock(
        utils.parseUnits(`${amount}`, coin?.decimals),
        {
          value: settlementFee,
        }
      );
    },
    [erc20LockingConnectorContract, getBridgeContract, coin]
  );

  const lock = async (amount: number, onSuccess: () => void) => {
    if (!account) {
      setStatus("Fail");
      setError("Contract not available");
      return;
    }
    setIsLoading(true);
    approve(
      erc20LockingConnectorContract!.address,
      amount,
      async () => {
        asyncCallback(
          async () => {
            return await onLock(amount);
          },
          () => {
            setIsLoading(false);
            setStatus("Success");
            setError("");
            onSuccess();
          },
          onError
        );
      },
      onError
    );
  };

  const onError = () => {
    setStatus("Fail");
    setError("Transaction failed");
    setIsLoading(false);
  };

  const resetState = () => {
    setStatus("");
    setError("");
  };

  useEffect(() => {
    resetState();
  }, [account]);

  return { lock, isLoading, status, error, resetState };
};
