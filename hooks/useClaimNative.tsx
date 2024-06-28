import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContract } from "./useContract";
import { useConnection } from "./useConnection";
import { useWalletPopup } from "../context/wallet-popup";

export const useClaimNative = () => {
  const { account } = useConnection();
  const { nativeConnectorContract } = useContract();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [fee, setFee] = useState<string | null>(null);

  const { asyncCallback } = useWalletPopup();

  useEffect(() => {
    const getFeeToClaim = async () => {
      const feeToClain = await nativeConnectorContract!.feeToClaim(account);
      const valueInEther = ethers.utils.formatEther(feeToClain.toString());
      setFee(valueInEther);
    };
    void getFeeToClaim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, nativeConnectorContract]);

  const onClaim = useCallback(
    async (account: string) => {
      const feeToClain = await nativeConnectorContract!.feeToClaim(account);
      const valueInEther = ethers.utils.formatEther(feeToClain.toString());
      setFee(valueInEther);
      return await nativeConnectorContract!.claim({
        value: ethers.utils.parseEther(valueInEther),
      });
    },
    [nativeConnectorContract]
  );

  const claim = async (onSuccess: () => void) => {
    if (!nativeConnectorContract || !account) {
      setStatus("Fail");
      setError("Contract not available");
      return;
    }
    setIsLoading(true);
    asyncCallback(
      async () => {
        return await onClaim(account);
      },
      () => {
        setIsLoading(false);
        setStatus("Lock successful");
        setError("");
        onSuccess();
      },
      () => {
        setIsLoading(false);
        setStatus("Fail");
        setError("Transaction failed");
      }
    );
  };

  const resetState = () => {
    setStatus("");
    setError("");
  };

  useEffect(() => {
    resetState();
  }, [account]);

  return { claim, isLoading, status, error, resetState, fee };
};
