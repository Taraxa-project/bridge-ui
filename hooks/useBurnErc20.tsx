import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContract } from "./useContract";
import { useConnection } from "./useConnection";
import { useWalletPopup } from "../context/wallet-popup";
import { useTokenApprove } from "./useTokenApprove";
import { useBridgeNetwork } from "../context/bridge-network";
import { useBridgeContract } from "./useBridgeContract";

export const useBurnErc20 = () => {
  const { account } = useConnection();
  const { erc20MintingConnectorContract } = useContract();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { coin } = useBridgeNetwork();
  const decimals = coin?.decimals || 18;

  const { approve } = useTokenApprove();
  const { asyncCallback } = useWalletPopup();

  const { fromNetwork } = useBridgeNetwork();
  const { getSettlementFee } = useBridgeContract(fromNetwork);

  const onBurn = useCallback(
    async (amount: number): Promise<ethers.providers.TransactionResponse> => {
      const settlementFee = await getSettlementFee();

      const valueInSmallestUnit = ethers.utils.parseUnits(
        amount.toString(),
        decimals
      );
      return await erc20MintingConnectorContract!.burn(valueInSmallestUnit, {
        value: settlementFee,
      });
    },
    [erc20MintingConnectorContract, getSettlementFee, decimals]
  );

  const burn = async (amount: number, onSuccess: () => void) => {
    if (!erc20MintingConnectorContract || !account || !amount) {
      setStatus("Fail");
      setError("Contract not available");
      return;
    }
    setIsLoading(true);
    approve(
      erc20MintingConnectorContract.address,
      amount,
      async () => {
        asyncCallback(
          async () => {
            return await onBurn(amount);
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
    setIsLoading(false);
  };

  useEffect(() => {
    resetState();
  }, [account]);

  return { burn, isLoading, status, error, resetState };
};
